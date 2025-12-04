
import React, { useState } from 'react';
import { Upload, File, Image, Video, Music, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCourseMedia } from '@/hooks/useCourseMedia';

interface MediaUploadProps {
  moduleId: string;
  onUploadComplete?: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ moduleId, onUploadComplete }) => {
  const [dragOver, setDragOver] = useState(false);
  const { uploadMedia, isUploading } = useCourseMedia(moduleId);

  const getMediaType = (file: File): 'video' | 'audio' | 'document' | 'image' => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('image/')) return 'image';
    return 'document';
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-8 w-8" />;
      case 'audio': return <Music className="h-8 w-8" />;
      case 'image': return <Image className="h-8 w-8" />;
      default: return <FileText className="h-8 w-8" />;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = getMediaType(file);
      
      await uploadMedia(file, mediaType);
    }

    onUploadComplete?.();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Course Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground">Uploading media...</p>
              <Progress value={50} className="w-full" />
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports videos, audio, images, and documents
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[
                  { type: 'video', label: 'Videos', formats: 'MP4, WebM, AVI' },
                  { type: 'audio', label: 'Audio', formats: 'MP3, WAV, AAC' },
                  { type: 'image', label: 'Images', formats: 'JPG, PNG, GIF' },
                  { type: 'document', label: 'Documents', formats: 'PDF, DOC, PPT' }
                ].map((item) => (
                  <div key={item.type} className="text-center p-3 border rounded-lg">
                    <div className="text-primary mb-2 flex justify-center">
                      {getMediaIcon(item.type)}
                    </div>
                    <h4 className="font-medium text-sm">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.formats}</p>
                  </div>
                ))}
              </div>
              
              <input
                type="file"
                multiple
                accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="media-upload"
              />
              <Button asChild>
                <label htmlFor="media-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </>
          )}
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Supported Formats:</h4>
          <div className="flex flex-wrap gap-2">
            {['MP4', 'WebM', 'MP3', 'WAV', 'JPG', 'PNG', 'PDF', 'DOC', 'PPT'].map((format) => (
              <Badge key={format} variant="secondary" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
