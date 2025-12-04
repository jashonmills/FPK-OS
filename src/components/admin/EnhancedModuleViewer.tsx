
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, FileText, Headphones, Image, Download } from 'lucide-react';

interface ModuleMetadata {
  video_url?: string;
  audio_url?: string;
  pdf_url?: string;
  word_url?: string;
  image_url?: string;
  embed_url?: string;
  [key: string]: unknown;
}

interface ModuleViewerProps {
  module: {
    id: string;
    title: string;
    description?: string;
    content_type: string;
    video_url?: string;
    audio_url?: string;
    pdf_url?: string;
    word_url?: string;
    image_url?: string;
    metadata?: ModuleMetadata;
  };
}

const EnhancedModuleViewer: React.FC<ModuleViewerProps> = ({ module }) => {
  const renderContent = () => {
    // Check for direct URL fields first, then fallback to metadata
    const videoUrl = module.video_url || module.metadata?.video_url;
    const audioUrl = module.audio_url || module.metadata?.audio_url;
    const pdfUrl = module.pdf_url || module.metadata?.pdf_url;
    const wordUrl = module.word_url || module.metadata?.word_url;
    const imageUrl = module.image_url || module.metadata?.image_url;
    const embedUrl = module.metadata?.embed_url;

    // Interactive content (like Learning State embed)
    if (module.content_type === 'interactive' && embedUrl) {
      return (
        <div className="space-y-4">
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              title={module.title}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    // Video content
    if (videoUrl) {
      return (
        <div className="space-y-4">
          <div className="w-full">
            <video
              controls
              className="w-full rounded-lg"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );
    }

    // Audio content
    if (audioUrl) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Headphones className="h-12 w-12 text-gray-400 mb-4" />
          </div>
          <audio controls className="w-full">
            <source src={audioUrl} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // PDF content
    if (pdfUrl) {
      return (
        <div className="space-y-4">
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title={module.title}
            />
          </div>
          <Button asChild variant="outline" className="w-full">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          </Button>
        </div>
      );
    }

    // Image content
    if (imageUrl) {
      return (
        <div className="space-y-4">
          <img
            src={imageUrl}
            alt={module.title}
            className="w-full rounded-lg"
          />
        </div>
      );
    }

    // Word document
    if (wordUrl) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-gray-600">Word Document</p>
              <p className="text-sm text-gray-500">Click below to download</p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <a href={wordUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download Document
            </a>
          </Button>
        </div>
      );
    }

    // Fallback for text or no content
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
        <p className="text-gray-600">This module doesn't have any content yet.</p>
      </div>
    );
  };

  const getContentTypeIcon = () => {
    switch (module.content_type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'audio':
        return <Headphones className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {getContentTypeIcon()}
            <span>{module.title}</span>
          </CardTitle>
          <Badge variant="outline">
            {module.content_type}
          </Badge>
        </div>
        {module.description && (
          <p className="text-gray-600">{module.description}</p>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleViewer;
