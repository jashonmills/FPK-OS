// src/components/analytics/S3TestUploader.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// --- The Secure API Endpoint ---
// This is the public "phone number" for our secure Lambda function.
const SECURE_UPLOAD_URL = "https://43amvrzncl.execute-api.us-east-2.amazonaws.com/default/fpkx-secure-s3-uploader";

export const S3TestUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    setUploadStatus("loading");
    setErrorMessage("");

    try {
      // 1. Prepare the data to be sent.
      // The Lambda function expects an object with a 'fileContent' property.
      const payload = {
        fileContent: `This is a SECURE file upload via Lambda on ${new Date().toISOString()}`,
      };

      // 2. Make a secure POST request to our API Gateway URL.
      const response = await fetch(SECURE_UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 3. Check if the Lambda function returned an error.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      // 4. If we get here, the upload was successful.
      const result = await response.json();
      setUploadStatus("success");
      console.log("Lambda Response:", result);
    } catch (err: any) {
      setUploadStatus("error");
      setErrorMessage(err.message || "An unknown error occurred.");
      console.error("Secure Upload Error:", err);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-yellow-500 rounded-lg my-6">
      <h3 className="text-lg font-semibold mb-2 text-yellow-500">AWS S3 Test Panel (Secure v2)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This button now calls a secure AWS Lambda function to perform the upload. The secret keys are no longer in the
        browser.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={handleUpload} disabled={uploadStatus === "loading"}>
          Test Secure Upload
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
