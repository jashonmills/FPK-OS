
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface EPUBReaderFooterProps {
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const EPUBReaderFooter: React.FC<EPUBReaderFooterProps> = ({
  onClose,
  onPrevPage,
  onNextPage
}) => {
  return (
    <div className="flex-shrink-0 p-4 border-t">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          <Home className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPrevPage}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" onClick={onNextPage}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EPUBReaderFooter;
