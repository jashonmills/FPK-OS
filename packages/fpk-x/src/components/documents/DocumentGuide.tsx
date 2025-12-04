import { useState, useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileText, BarChart3 } from 'lucide-react';
import { DOCUMENT_TYPES_FOR_CLIENT, ClientDocumentType } from '@/lib/document-types';

export const DocumentGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group documents by category
  const groupedDocs = useMemo(() => {
    const filtered = DOCUMENT_TYPES_FOR_CLIENT.filter(doc =>
      doc.doc_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.expected_data.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, typeof DOCUMENT_TYPES_FOR_CLIENT>);
  }, [searchTerm]);
  
  const categoryColors: Record<string, string> = {
    'Education': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    'Medical': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    'Therapy': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
    'Behavioral': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
    'Legal': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    'Daily Living': 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700',
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Document Guide</h2>
        <p className="text-muted-foreground">
          Learn which documents to upload and what insights they'll unlock
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search document types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(groupedDocs).map(([category, docs]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <span className="font-semibold">{category}</span>
                <Badge variant="secondary">{docs.length} types</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 mt-2">
                {docs.map(doc => (
                  <Card key={doc.doc_type} className="border-l-4 border-l-primary/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-base">{doc.doc_type}</h4>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="font-medium min-w-[120px]">What we extract:</span>
                          <span>{doc.expected_data}</span>
                        </div>
                        {doc.generates_chart && (
                          <div className="flex items-center gap-2 text-sm">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <span className="font-medium">Unlocks Chart:</span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {doc.generates_chart}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {Object.keys(groupedDocs).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No documents found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};
