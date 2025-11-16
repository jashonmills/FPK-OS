import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// Summary of change:
// - Removed top-level env reads and client creation.
// - Read VITE_* env vars inside the handler, validate them, create S3Client lazily,
//   and render a friendly error message when configuration is missing.

export const S3TestUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = async () => {
    setUploadStatus('loading');
    setErrorMessage('');

    // Read env values at time of action (safer than at module load)
    const REGION = import.meta.env.VITE_AWS_REGION;
    const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;
    const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

    if (!REGION || !BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      setUploadStatus('error');
      setErrorMessage('Missing AWS configuration. Ensure VITE_AWS_* vars are set in .env.local.');
      console.error("AWS Configuration missing:", {
        REGION,
        BUCKET_NAME,
        ACCESS_KEY_ID: !!ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: !!SECRET_ACCESS_KEY,
      });
      return;
    }

    // create S3 client lazily after validating config
    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });

    // Create a dummy file content
    const fileContent = `This is a test file uploaded from the FPK-X application on ${new Date().toISOString()}`;
    const fileName = `test-upload-${Date.now()}.txt`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: 'text/plain',
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      setUploadStatus('success');
      console.log(`Successfully uploaded ${fileName} to ${BUCKET_NAME}`);
    } catch (err: any) {
      setUploadStatus('error');
      setErrorMessage(err?.message || 'An unknown error occurred.');
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
        <Button onClick={handleUpload} disabled={uploadStatus === 'loading'}>
          {uploadStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test S3 Upload
        </Button>
        {uploadStatus === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
        {uploadStatus === 'error' && <AlertTriangle className="h-6 w-6 text-red-500" />}
      </div>
      {uploadStatus === 'error' && (
        <p className="text-sm text-red-500 mt-2">
          <strong>Error:</strong> {errorMessage}
        </p>
      )}
    </div>
  );
};
