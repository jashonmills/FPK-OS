// src/components/analytics/S3TestUploader.tsx

import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// --- !! OPERATION: HARDCODE TO VICTORY !! ---
// Bypassing the broken environment variable system on the Lovable platform.
// CRITICAL: Replace these placeholder values with your actual keys.
const HARDCODED_CONFIG = {
  REGION: "us-east-2",
  BUCKET_NAME: "fpkx-datalake-raw",
  ACCESS_KEY_ID: "YOUR_ACCESS_KEY_ID_HERE",
  SECRET_ACCESS_KEY: "YOUR_SECRET_ACCESS_KEY_HERE",
};
// --- !! END OF HARDCODED CONFIGURATION !! ---

export const S3TestUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    setUploadStatus("loading");
    setErrorMessage("");

    // 1. Validate the hardcoded configuration
    if (
      !HARDCODED_CONFIG.REGION ||
      !HARDCODED_CONFIG.BUCKET_NAME ||
      !HARDCODED_CONFIG.ACCESS_KEY_ID ||
      !HARDCODED_CONFIG.SECRET_ACCESS_KEY
    ) {
      setUploadStatus("error");
      setErrorMessage("Hardcoded configuration is incomplete. Please check the S3TestUploader.tsx file.");
      console.error("Hardcoded configuration is incomplete.", HARDCODED_CONFIG);
      return;
    }

    try {
      // 2. Create the S3 client LAZILY with the hardcoded config
      const s3Client = new S3Client({
        region: HARDCODED_CONFIG.REGION,
        credentials: {
          accessKeyId: HARDCODED_CONFIG.ACCESS_KEY_ID,
          secretAccessKey: HARDCODED_CONFIG.SECRET_ACCESS_KEY,
        },
      });

      // 3. Prepare and send the command
      const fileContent = `This is a test file uploaded from the FPK-X application on ${new Date().toISOString()}`;
      const fileName = `test-upload-${Date.now()}.txt`;
      const params = {
        Bucket: HARDCODED_CONFIG.BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: "text/plain",
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      setUploadStatus("success");
      console.log(`Successfully uploaded ${fileName} to ${HARDCODED_CONFIG.BUCKET_NAME}`);
    } catch (err: any) {
      setUploadStatus("error");
      setErrorMessage(err.message || "An unknown error occurred.");
      console.error("S3 Upload Error:", err);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-yellow-500 rounded-lg my-6">
      <h3 className="text-lg font-semibold mb-2 text-yellow-500">AWS S3 Test Panel</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the button to attempt to upload a test file named "test-upload-[timestamp].txt" to your S3 bucket.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={handleUpload} disabled={uploadStatus === "loading"}>
          {uploadStatus === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test S3 Upload
        </Button>
        {uploadStatus === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
        {uploadStatus === "error" && <AlertTriangle className="h-6 w-6 text-red-500" />}
      </div>
      {uploadStatus === "error" && (
        <p className="text-sm text-red-500 mt-2">
          <strong>Error:</strong> {errorMessage}
        </p>
      )}
    </div>
  );
};
