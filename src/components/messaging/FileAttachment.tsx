import React from "react";
import { Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCaptionStyles, CaptionStyle } from "./CaptionFormatting";

interface FileAttachmentProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  caption?: string | null;
  captionStyle?: CaptionStyle | null;
  onOpenImage?: (imageUrl: string) => void;
}

export const FileAttachment = ({ fileUrl, fileName, fileType, fileSize, caption, captionStyle, onOpenImage }: FileAttachmentProps) => {
  const isImage = fileType.startsWith("image/");

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isImage) {
    return (
      <div className="w-full max-w-[280px] sm:max-w-sm mx-auto">
        <img
          src={fileUrl}
          alt={fileName}
          className="rounded-lg max-h-[300px] w-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onOpenImage?.(fileUrl)}
        />
        {caption && (
          <div className="mt-2 bg-black/60 backdrop-blur-sm rounded-md p-2">
            <p 
              className="text-sm text-white font-medium break-words"
              style={captionStyle ? getCaptionStyles(captionStyle) : undefined}
            >
              {caption}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between mt-2 bg-black/60 backdrop-blur-sm rounded-md p-2">
          <span className="text-xs text-white font-medium truncate flex-1">{fileName}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 ml-2 text-white hover:text-white hover:bg-white/20"
            onClick={handleDownload}
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg bg-background/80 backdrop-blur-md max-w-sm shadow-lg">
      <File className="w-8 h-8 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
        {fileSize && (
          <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex-shrink-0 hover:bg-primary/20"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
};
