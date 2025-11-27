
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

interface FileUploadDropzoneProps {
  dragActive: boolean;
  uploading: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxFileSize: number;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  dragActive,
  uploading,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
  maxFileSize
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
        dragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
      <h3 className="text-base sm:text-lg font-medium mb-2 break-words px-2">
        Drop your files here or click to browse
      </h3>
      <div className="text-sm sm:text-base text-gray-600 mb-4 break-words px-2 leading-relaxed space-y-2">
        <p><strong>📁 Supported:</strong> PDF, DOC, DOCX, PPT, PPTX, TXT, MD, CSV, RTF</p>
        <p><strong>📏 Size limit:</strong> Up to {formatFileSize(maxFileSize)}</p>
        <p><strong>⚡ Processing:</strong> Smart timeout (3-8 minutes based on file size)</p>
        <p><strong>🔄 Preview mode:</strong> Review before saving to collection</p>
      </div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.md,.csv,.rtf"
        onChange={onFileInput}
        disabled={uploading}
      />
      <Button asChild disabled={uploading} size="sm" className="text-xs sm:text-sm">
        <label htmlFor="file-upload" className="cursor-pointer">
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          {uploading ? 'Processing...' : 'Choose Files'}
        </label>
      </Button>
    </div>
  );
};

export default FileUploadDropzone;
