
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ExternalLink, Info, Building2 } from 'lucide-react';
import { MuseumItem } from '@/services/MuseumService';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModelViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MuseumItem | null;
}

const ModelViewerModal: React.FC<ModelViewerModalProps> = ({ 
  isOpen, 
  onClose, 
  item 
}) => {
  const isMobile = useIsMobile();

  if (!item) return null;

  const renderMediaContent = () => {
    if (item.isThreeD && item.embedUrl) {
      // For Smithsonian 3D models, try to create an embedded viewer
      if (item.source === 'smithsonian') {
        return (
          <div className="w-full aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">3D Model</h3>
              <p className="text-gray-300 mb-4">
                This is a 3D model from the Smithsonian collection.
              </p>
              <Button
                variant="outline"
                onClick={() => window.open(item.embedUrl, '_blank')}
                className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View 3D Model
              </Button>
            </div>
          </div>
        );
      }
    }

    // Default to showing the thumbnail image
    return (
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop';
        }}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-screen h-screen max-w-none max-h-none m-0 rounded-none' 
          : 'max-w-6xl w-full h-[90vh]'
        } 
        p-0 gap-0 bg-slate-950 flex flex-col
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700
          ${isMobile ? 'flex-col gap-3' : 'flex-row'}
        `}>
          <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : ''}`}>
            <Building2 className="h-6 w-6 text-purple-400 flex-shrink-0" />
            <div className={isMobile ? 'flex-1' : ''}>
              <h2 className={`font-bold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
                {item.title}
              </h2>
              <p className="text-sm text-gray-300">
                {item.source === 'smithsonian' ? 'Smithsonian Institution' : 'The Metropolitan Museum'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size={isMobile ? "default" : "sm"}
            onClick={onClose}
            className={`text-gray-300 hover:text-white hover:bg-slate-700 ${
              isMobile ? 'min-h-[44px] min-w-[44px]' : ''
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className={`flex-1 overflow-hidden ${isMobile ? 'flex flex-col' : 'flex'}`}>
          {/* Media Display */}
          <div className={`bg-black flex items-center justify-center p-4 ${
            isMobile ? 'flex-1' : 'flex-1'
          }`}>
            <div className="w-full max-w-4xl">
              {renderMediaContent()}
            </div>
          </div>

          {/* Info Panel */}
          <div className={`bg-slate-900 border-slate-700 ${
            isMobile 
              ? 'border-t overflow-y-auto max-h-[40vh]' 
              : 'w-80 border-l flex flex-col'
          }`}>
            <ScrollArea className={`${isMobile ? 'h-full' : 'flex-1'} p-4`}>
              {/* What is this? */}
              <Card className="mb-4 bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    What is this?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>

              {/* Details */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-sm">{item.title}</h4>
                  </div>

                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Source</p>
                        <p className="text-xs text-gray-300">
                          {item.source === 'smithsonian' ? 'Smithsonian Institution' : 'The Metropolitan Museum'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className={`w-3 h-3 rounded-full ${
                        item.isThreeD ? 'bg-purple-500' : 'bg-blue-500'
                      } flex-shrink-0`}></span>
                      <span>Type: {item.isThreeD ? '3D Model' : 'Artwork'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
                      <span>Collection: {item.source === 'smithsonian' ? 'Smithsonian Institution' : 'The Metropolitan Museum'}</span>
                    </div>
                  </div>

                  {item.embedUrl && (
                    <div className="pt-3 border-t border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.embedUrl, '_blank')}
                        className="w-full bg-purple-600 border-purple-500 text-white hover:bg-purple-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelViewerModal;
