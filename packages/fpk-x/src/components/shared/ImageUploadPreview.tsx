import { X, Upload } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadPreviewProps {
  files: File[];
  previewUrls: string[];
  onFilesChange: (files: File[]) => void;
  onPreviewsChange: (urls: string[]) => void;
  maxFiles?: number;
}

export const ImageUploadPreview = ({
  files,
  previewUrls,
  onFilesChange,
  onPreviewsChange,
  maxFiles = 5
}: ImageUploadPreviewProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    const newPreviews: string[] = [];
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target?.result as string);
        if (newPreviews.length === filesToAdd.length) {
          onFilesChange([...files, ...filesToAdd]);
          onPreviewsChange([...previewUrls, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    onPreviewsChange(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-accent/50 transition-colors"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add Image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <p className="text-xs text-muted-foreground">
        {files.length}/{maxFiles} images • Max 1MB each
      </p>
    </div>
  );
};
