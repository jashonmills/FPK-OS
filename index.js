const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Writable } = require("stream");
const fs = require("fs");
const path = require("path");
const fluent = require("fluent-ffmpeg");

// --- IMPORTANT: ffmpeg/ffprobe paths in Lambda ---
const FFMPEG_PATH = "/tmp/ffmpeg";
const FFPROBE_PATH = "/tmp/ffprobe";

if (process.env.LAMBDA_TASK_ROOT) {
  const ffmpegSource = path.join(process.env.LAMBDA_TASK_ROOT, "lib", "ffmpeg");
  const ffprobeSource = path.join(process.env.LAMBDA_TASK_ROOT, "lib", "ffprobe");

  if (fs.existsSync(ffmpegSource)) {
    fs.copyFileSync(ffmpegSource, FFMPEG_PATH);
    fs.chmodSync(FFMPEG_PATH, "755");
    fluent.setFfmpegPath(FFMPEG_PATH);
  }
  if (fs.existsSync(ffprobeSource)) {
    fs.copyFileSync(ffprobeSource, FFPROBE_PATH);
    fs.chmodSync(FFPROBE_PATH, "755");
    fluent.setFfprobePath(FFPROBE_PATH);
  }
}

// ============================================
// AWS CLIENTS
// ============================================
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const pollyClient = new PollyClient({ region: "us-east-1" });
const s3Client = new S3Client({ region: "us-east-2" });

// ============================================
// CONSTANTS
// ============================================
const BUCKET_NAME = process.env.AUDIO_BUCKET || "fpkx-ai-coach-audio";
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || "CHANGE_ME_MODEL_ID";

// Map personas → Polly voices
const VOICE_MAP = {
  AL: { voiceId: "Matthew", useSsml: false },
  BETTY: { voiceId: "Joanna", useSsml: false },
  OWL: { voiceId: "Kendra", useSsml: true }, // Owl uses Kendra with SSML
};

// ============================================
// MAIN HANDLER
// ============================================
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { question, mode, history } = parseRequest(event);

  console.log("Parsed request:", { question, mode, historyLength: history.length });

  // 1) Decide mode (intent) if not provided
  let effectiveMode = mode;
  try {
    if (!effectiveMode) {
      effectiveMode = await detectIntentWithBedrock({ question, history });
    }
  } catch (err) {
    console.error("Intent detection failed, defaulting mode to 'study_coach':", err);
    effectiveMode = "study_coach";
  }
  console.log("Effective mode:", effectiveMode);

  // 2) Generate multi-persona script via Bedrock
  let script;
  try {
    script = await generateScriptWithBedrock({
      mode: effectiveMode,
      question,
      history,
    });
  } catch (err) {
    console.error("Script generation failed, falling back to mock script:", err);
    script = getFallbackScript();
  }

  console.log("Generated script:", script);

  const audioBuffers = [];

  try {
    // 3) TTS for each line in the script
    for (const part of script) {
      const persona = (part.persona || part.speaker || "AL").toUpperCase();
      const text = part.text || "";

      const voiceCfg = VOICE_MAP[persona] || VOICE_MAP.AL;
      const voiceId = voiceCfg.voiceId;
      const useSsml = voiceCfg.useSsml;

      console.log(`Synthesizing speech for ${persona} using voice ${voiceId} (SSML: ${useSsml})`);

      const pollyParams = {
        OutputFormat: "mp3",
        VoiceId: voiceId,
        Engine: "neural",
      };

      if (useSsml) {
        // Owl: Kendra with upbeat SSML prosody
        pollyParams.TextType = "ssml";
        pollyParams.Text = wrapOwlTextWithSSML(text);
      } else {
        // Al & Betty: plain text
        pollyParams.Text = text;
      }

      const pollyCommand = new SynthesizeSpeechCommand(pollyParams);
      const pollyResponse = await pollyClient.send(pollyCommand);
      const buffer = await streamToBuffer(pollyResponse.AudioStream);
      audioBuffers.push(buffer);
    }

    // 4) Merge audio buffers into single MP3
    console.log(`Merging ${audioBuffers.length} audio buffers...`);
    const mergedAudioBuffer = await mergeMp3Buffers(audioBuffers);
    console.log("Audio buffers merged successfully.");

    // 5) Save merged file to S3
    const key = `study-coach/${effectiveMode}/merged-${Date.now()}.mp3`;

    const s3Command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: mergedAudioBuffer,
      ContentType: "audio/mpeg",
    });
    await s3Client.send(s3Command);
    console.log(`Uploaded merged audio to S3: ${BUCKET_NAME}/${key}`);

    // 6) Generate presigned URL
    const urlCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const audioUrl = await getSignedUrl(s3Client, urlCommand, { expiresIn: 3600 });
    console.log("Presigned URL:", audioUrl);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        message: "Successfully generated multi-persona Study Coach audio.",
        mode: effectiveMode,
        script,
        audio_url: audioUrl,
      }),
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        message: "Failed to process request.",
        error: error.message,
      }),
    };
  }
};

// ============================================
// REQUEST PARSING
// ============================================
function parseRequest(event) {
  let body = {};
  try {
    if (event && typeof event.body === "string") {
      body = JSON.parse(event.body);
    } else if (event && typeof event === "object" && !event.body) {
      body = event;
    }
  } catch (err) {
    console.warn("Failed to parse event body, using empty payload:", err);
    body = {};
  }

  const question =
    body.question ||
    body.prompt ||
    "Can you explain the formula for the area of a rectangle?";
  const mode = body.mode || null;
  const history = Array.isArray(body.history) ? body.history : [];

  return { question, mode, history };
}

// ============================================
// BEDROCK HELPERS
// ============================================

// NOTE: You may need to adjust the request body format depending on which Bedrock model you use.
// This is written generically so you can adapt to Titan/Claude/etc.
async function callBedrockModel(prompt) {
  if (!BEDROCK_MODEL_ID || BEDROCK_MODEL_ID === "CHANGE_ME_MODEL_ID") {
    throw new Error("BEDROCK_MODEL_ID env var is not set.");
  }

  const input = {
    // Generic text-style body; adjust for your chosen model if needed.
    inputText: prompt,
  };

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(input),
  });

  const response = await bedrockClient.send(command);
  const raw = Buffer.from(response.body).toString("utf8");

  // For many Bedrock text models, the response looks like:
  // { "results": [ { "outputText": "..." } ] }
  // Adjust this parsing function if your model returns a different shape.
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse Bedrock response as JSON:", raw);
    throw err;
  }

  let outputText = "";
  if (parsed.results && parsed.results[0] && parsed.results[0].outputText) {
    outputText = parsed.results[0].outputText;
  } else if (parsed.outputText) {
    outputText = parsed.outputText;
  } else if (parsed.completions && parsed.completions[0]?.data?.text) {
    outputText = parsed.completions[0].data.text;
  } else {
    outputText = raw;
  }

  return outputText.trim();
}

async function detectIntentWithBedrock({ question, history }) {
  const prompt = `
You are an intent router for an AI study coach.

Given the student's question and optional conversation history, choose EXACTLY ONE mode:
- "quick_answer" for simple definitions, facts, or formulas.
- "study_coach" for step-by-step reasoning, conceptual explanations, or practice.
- "podcast" when the student wants a broad topic overview or "teach me about X".

Return ONLY one of these strings: quick_answer, study_coach, or podcast.

Student question:
${question}

Conversation history (may be empty):
${JSON.stringify(history).slice(0, 2000)}
`;

  const text = await callBedrockModel(prompt);
  const lower = text.toLowerCase();

  if (lower.includes("podcast")) return "podcast";
  if (lower.includes("quick_answer")) return "quick_answer";
  if (lower.includes("study_coach")) return "study_coach";

  // Fallback
  return "study_coach";
}

async function generateScriptWithBedrock({ mode, question, history }) {
  const baseInstruction = `
You are generating a short multi-speaker script for an AI study coach with three personas:

1. AL (The Expert): direct, factual teacher who explains concepts clearly.
2. BETTY (The Guide): Socratic, asks questions, invites the student to think.
3. OWL (The Context Owl): gives real-world examples, encouragement, and explains why this matters.

You must output ONLY valid JSON in this exact format:
[
  { "persona": "AL", "text": "..." },
  { "persona": "BETTY", "text": "..." },
  { "persona": "OWL", "text": "..." }
]

No comments, no extra keys, no markdown.
`;

  const modeInstruction =
    mode === "quick_answer"
      ? `
Mode: quick_answer.
Goal: Provide a short, direct answer from AL only (1–3 lines max).
BETTY and OWL should NOT speak in this mode.
Output JSON with persona "AL" only.
`
      : mode === "podcast"
      ? `
Mode: podcast.
Goal: Create a 3–7 minute scripted mini-lesson with 20–40 lines of dialogue.
Structure:
- BETTY introduces the topic and hooks interest.
- AL explains core concepts and key points.
- BETTY asks 2–4 reflective or deepening questions.
- OWL gives fun, real-world examples and explains why this matters in life, school, or careers.
- BETTY wraps up with a short summary and reflection prompt.
`
      : `
Mode: study_coach.
Goal: Short teaching loop (4–10 lines) using AL, BETTY, and OWL.
- AL defines or explains the concept.
- BETTY asks 1–2 simple questions to help the student think.
- OWL gives 1–2 real-world examples or encouragement.
`;

  const userPrompt = `
Student question or topic:
"${question}"

Conversation history for context:
${JSON.stringify(history).slice(0, 2000)}
`;

  const fullPrompt = baseInstruction + modeInstruction + "\n" + userPrompt;

  const rawText = await callBedrockModel(fullPrompt);
  const jsonText = extractJsonArray(rawText);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error("Failed to parse script JSON, rawText:", rawText);
    throw err;
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Generated script is not a non-empty array.");
  }

  return parsed;
}

// Attempt to extract a JSON array substring from model output
function extractJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON array found in model output.");
  }
  return text.slice(start, end + 1);
}

// Fallback script if Bedrock fails
function getFallbackScript() {
  return [
    {
      persona: "AL",
      text: "The formula for the area of a rectangle is length times width.",
    },
    {
      persona: "BETTY",
      text: "Thank you, Al. Based on that, how would you find the area of a rectangle that is 3 by 5?",
    },
    {
      persona: "OWL",
      text: "Hoo-hoo! Area shows how much space a shape covers. It's super useful in real life, like measuring floors, walls, or gardens!",
    },
  ];
}

// ============================================
// OWL SSML WRAPPER
// ============================================
function wrapOwlTextWithSSML(text) {
  // Basic escaping for XML special chars
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `
<speak>
  <prosody pitch="+12%" rate="115%" volume="+2dB">
    ${escaped}
  </prosody>
</speak>`;
}

// ============================================
// HELPER FUNCTIONS (UNCHANGED CORE LOGIC)
// ============================================

// Converts a readable stream into a buffer
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// Merges an array of MP3 buffers into a single MP3 buffer using fluent-ffmpeg
async function mergeMp3Buffers(buffers) {
  return new Promise((resolve, reject) => {
    const command = fluent();
    const tempFilePaths = [];
    const outputPath = `/tmp/merged_${Date.now()}.mp3`;

    buffers.forEach((buffer, index) => {
      const tempPath = `/tmp/audio_${index}.mp3`;
      fs.writeFileSync(tempPath, buffer);
      command.input(tempPath);
      tempFilePaths.push(tempPath);
    });

    command
      .on("error", (err) => {
        console.error("FFMPEG Error:", err.message);
        reject(err);
      })
      .on("end", () => {
        console.log("FFMPEG processing finished.");
        const mergedBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        tempFilePaths.forEach((filePath) => fs.unlinkSync(filePath));
        resolve(mergedBuffer);
      })
      .mergeToFile(outputPath);
  });
}
