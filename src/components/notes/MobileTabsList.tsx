
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FileText, Upload, Zap, Brain } from 'lucide-react';

interface MobileTabsListProps {
  isMobile: boolean;
}

const MobileTabsList: React.FC<MobileTabsListProps> = ({ isMobile }) => {
  if (!isMobile) {
    return (
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Flashcards
        </TabsTrigger>
        <TabsTrigger value="rag" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Enhancement
        </TabsTrigger>
        <TabsTrigger value="progress" className="flex items-center gap-2">
          Progress
        </TabsTrigger>
      </TabsList>
    );
  }

  return (
    <ScrollArea className="w-full">
      <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
        <TabsTrigger value="notes" className="flex items-center gap-2 whitespace-nowrap">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2 whitespace-nowrap">
          <Upload className="h-4 w-4" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="flex items-center gap-2 whitespace-nowrap">
          <Zap className="h-4 w-4" />
          Flashcards
        </TabsTrigger>
        <TabsTrigger value="rag" className="flex items-center gap-2 whitespace-nowrap">
          <Brain className="h-4 w-4" />
          AI Enhancement
        </TabsTrigger>
        <TabsTrigger value="progress" className="flex items-center gap-2 whitespace-nowrap">
          Progress
        </TabsTrigger>
      </TabsList>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default MobileTabsList;
