/**
 * Unified Module Content Component
 * Provides consistent layout for all module types (text, audio, video, PDF)
 */

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MediaPlayer from './MediaPlayer';
import PDFDownloadButton from './PDFDownloadButton';
import OptimizedPDFViewer from '@/components/library/OptimizedPDFViewer';
import { FileText, Headphones, Video, Download } from 'lucide-react';

interface ModuleContentProps {
  moduleId: string;
  courseId: string;
  title: string;
  type: 'text' | 'audio' | 'video' | 'pdf';
  duration?: string;
  content?: {
    text?: string;
    audioUrl?: string;
    videoUrl?: string;
    pdfUrl?: string;
    pdfFileName?: string;
    backgroundImage?: string;
  };
  isCompleted?: boolean;
  isActive?: boolean;
  progress?: number;
}

export const ModuleContent: React.FC<ModuleContentProps> = ({
  moduleId,
  courseId,
  title,
  type,
  duration,
  content,
  isCompleted = false,
  isActive = false,
  progress = 0
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'pdf': return <Download className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'pdf': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getTypeColor()}>
              {getTypeIcon()}
              <span className="ml-1 capitalize">{type}</span>
            </Badge>
            {duration && (
              <Badge variant="outline">
                {duration} min
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="bg-green-600">
                Complete
              </Badge>
            )}
            {isActive && (
              <Badge variant="default" className="bg-blue-600">
                Current
              </Badge>
            )}
          </div>
        </div>
        
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>

      <Separator />

      {/* Content */}
      <CardContent className="p-6">
        {/* Background Image (for special modules like Module1A) */}
        {content?.backgroundImage && (
          <div 
            className="relative rounded-lg mb-6 h-48 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-90">
                  {type === 'audio' ? 'Listen to learn' : 'Interactive content'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Text Content */}
        {type === 'text' && content?.text && (
          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.text) }} />
          </div>
        )}

        {/* Audio Player */}
        {type === 'audio' && content?.audioUrl && (
          <div className="space-y-4">
            <MediaPlayer
              src={content.audioUrl}
              type="audio"
              title={title}
              mediaId={moduleId}
              courseId={courseId}
              moduleId={moduleId}
            />
          </div>
        )}

        {/* Video Player */}
        {type === 'video' && content?.videoUrl && (
          <div className="space-y-4">
            <MediaPlayer
              src={content.videoUrl}
              type="video"
              title={title}
              mediaId={moduleId}
              courseId={courseId}
              moduleId={moduleId}
            />
          </div>
        )}

        {/* PDF Content */}
        {type === 'pdf' && content?.pdfUrl && (
          <div className="space-y-4">
            {/* Download Button */}
            <div className="flex justify-center">
              <PDFDownloadButton
                pdfUrl={content.pdfUrl}
                fileName={content.pdfFileName || `${title}.pdf`}
                moduleId={moduleId}
                courseId={courseId}
                size="lg"
                className="w-full max-w-sm"
              />
            </div>

            {/* PDF Preview Info */}
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">{content.pdfFileName || `${title}.pdf`}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click the download button above to access this PDF resource.
              </p>
            </div>
          </div>
        )}

        {/* Fallback for missing content */}
        {!content && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Content for this module is being prepared.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleContent;