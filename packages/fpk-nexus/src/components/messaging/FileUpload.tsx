import React, { useCallback, useState } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CaptionFormatting, CaptionStyle } from "./CaptionFormatting";
import { useCaptionPreferences } from "@/hooks/useCaptionPreferences";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  caption: string;
  onCaptionChange: (caption: string) => void;
  captionStyle: CaptionStyle;
  onCaptionStyleChange: (style: CaptionStyle) => void;
}

export const FileUpload = ({ onFileSelect, selectedFile, onClearFile, caption, onCaptionChange, captionStyle, onCaptionStyleChange }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { defaultStyle } = useCaptionPreferences();

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const file = files[0];
      
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      onFileSelect(file);
      // Apply default formatting for images
      if (file.type.startsWith("image/")) {
        onCaptionStyleChange(defaultStyle);
      }
    },
    [onFileSelect, defaultStyle, onCaptionStyleChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      onFileSelect(file);
      // Apply default formatting for images
      if (file.type.startsWith("image/")) {
        onCaptionStyleChange(defaultStyle);
      }
    },
    [onFileSelect, defaultStyle, onCaptionStyleChange]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isImage = selectedFile?.type.startsWith("image/");

  if (selectedFile) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isImage ? (
              <ImageIcon className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <File className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={onClearFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {isImage && (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Add a caption for this image (optional)"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              maxLength={200}
              className="text-sm"
            />
            {caption && (
              <CaptionFormatting
                style={captionStyle}
                onStyleChange={onCaptionStyleChange}
                showTemplates={true}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <label className="flex flex-col items-center gap-2 cursor-pointer">
        <Upload className="w-6 h-6 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">Drop files here or click to upload</p>
          <p className="text-xs text-muted-foreground">Max size: 10MB</p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </label>
    </div>
  );
};
