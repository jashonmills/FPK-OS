const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Writable } = require('stream');
const fs = require('fs');
const path = require('path');
const fluent = require('fluent-ffmpeg');

// --- IMPORTANT: This tells fluent-ffmpeg where to find the ffmpeg/ffprobe binaries ---
// We will place them in the /tmp/ directory in the Lambda environment
const FFMPEG_PATH = '/tmp/ffmpeg';
const FFPROBE_PATH = '/tmp/ffprobe';

if (process.env.LAMBDA_TASK_ROOT) { // Check if running in AWS Lambda
    const ffmpegSource = path.join(process.env.LAMBDA_TASK_ROOT, 'lib', 'ffmpeg');
    const ffprobeSource = path.join(process.env.LAMBDA_TASK_ROOT, 'lib', 'ffprobe');

    if (fs.existsSync(ffmpegSource)) {
        fs.copyFileSync(ffmpegSource, FFMPEG_PATH);
        fs.chmodSync(FFMPEG_PATH, '755');
        fluent.setFfmpegPath(FFMPEG_PATH);
    }
    if (fs.existsSync(ffprobeSource)) {
        fs.copyFileSync(ffprobeSource, FFPROBE_PATH);
        fs.chmodSync(FFPROBE_PATH, '755');
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
// MAIN HANDLER
// ============================================
exports.handler = async (event) => { // NOTE: Changed from "export const" to "exports."
    console.log("Received event:", JSON.stringify(event, null, 2));

    // This is a mock script. In the future, this will come from Bedrock.
    const mockScript = {
        response_type: "handoff",
        script: [
            { persona: "AL", text: "The formula for the area of a rectangle is length times width." },
            { persona: "BETTY", text: "Thank you, Al. Now, based on that formula, how would you approach this problem?" }
        ]
    };

    const { response_type, script } = mockScript;
    const audioBuffers = [];

    try {
        // --- Step 1: Generate audio for each part of the script ---
        for (const part of script) {
            const voiceId = part.persona === 'AL' ? 'Matthew' : 'Joanna';
            console.log(`Synthesizing speech for ${part.persona} with voice ${voiceId}`);

            const pollyCommand = new SynthesizeSpeechCommand({
                Text: part.text,
                OutputFormat: "mp3",
                VoiceId: voiceId,
                Engine: "neural",
            });
            const pollyResponse = await pollyClient.send(pollyCommand);
            const buffer = await streamToBuffer(pollyResponse.AudioStream);
            audioBuffers.push(buffer);
        }

        // --- Step 2: Merge the audio buffers into a single file ---
        console.log(`Merging ${audioBuffers.length} audio buffers...`);
        const mergedAudioBuffer = await mergeMp3Buffers(audioBuffers);
        console.log("Audio buffers merged successfully.");

        // --- Step 3: Save the merged file to S3 ---
        const bucketName = "fpkx-ai-coach-audio";
        const key = `merged-${Date.now()}.mp3`;

        const s3Command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: mergedAudioBuffer,
            ContentType: "audio/mpeg",
        });
        await s3Client.send(s3Command);
        console.log(`Successfully uploaded merged audio to S3: ${key}`);

        // --- Step 4: Generate and return the presigned URL ---
        const urlCommand = new GetObjectCommand({ Bucket: bucketName, Key: key });
        const audioUrl = await getSignedUrl(s3Client, urlCommand, { expiresIn: 3600 });
        console.log("Generated presigned URL:", audioUrl);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'content-type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({
                message: "Successfully generated and merged audio!",
                audio_url: audioUrl
            }),
        };

    } catch (error) {
        console.error("An error occurred:", error);
        return { 
            statusCode: 500, 
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'content-type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({ message: "Failed to process request.", error: error.message }) 
        };
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Converts a readable stream into a buffer
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

// Merges an array of MP3 buffers into a single MP3 buffer using fluent-ffmpeg
async function mergeMp3Buffers(buffers) {
    return new Promise((resolve, reject) => {
        const command = fluent();
        const tempFilePaths = [];

        // fluent-ffmpeg works with files, so we write buffers to temp files in the Lambda /tmp/ dir
        buffers.forEach((buffer, index) => {
            const tempPath = `/tmp/audio_${index}.mp3`;
            fs.writeFileSync(tempPath, buffer);
            command.input(tempPath);
            tempFilePaths.push(tempPath);
        });

        const outputStream = new Writable({
            write(chunk, encoding, callback) {
                this.chunks = (this.chunks || []);
                this.chunks.push(chunk);
                callback();
            },
            final(callback) {
                resolve(Buffer.concat(this.chunks));
                callback();
            }
        });

        command
            .on('error', (err) => {
                console.error('FFMPEG Error:', err.message);
                reject(err);
            })
            .on('end', () => {
                console.log('FFMPEG processing finished.');
                // Clean up temp files
                tempFilePaths.forEach(filePath => fs.unlinkSync(filePath));
            })
            .mergeToFile(outputStream);
    });
}
