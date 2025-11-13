import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentTypeSelectorProps {
  documentId: string;
  onClassified: () => void;
}

const DOCUMENT_TYPES = [
  { value: 'IEP', label: 'IEP', description: 'Individualized Education Program' },
  { value: 'BIP', label: 'BIP', description: 'Behavior Intervention Plan' },
  { value: 'FBA', label: 'FBA', description: 'Functional Behavior Assessment' },
  { value: 'Progress_Report', label: 'Progress Report', description: 'Student Progress Report' },
  { value: 'Evaluation_Report', label: 'Evaluation Report', description: 'Professional Evaluation' },
  { value: '504_Plan', label: '504 Plan', description: 'Section 504 Plan' },
  { value: 'Medical_Record', label: 'Medical Record', description: 'Medical Documentation' },
  { value: 'Incident_Report', label: 'Incident Report', description: 'Behavioral Incident Report' },
  { value: 'General_Document', label: 'General Document', description: 'Other Document Type' }
];

export function DocumentTypeSelector({ documentId, onClassified }: DocumentTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedType) {
      toast.error('Please select a document type');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('v3-classify-document', {
        body: {
          document_id: documentId,
          category: selectedType
        }
      });

      if (error) throw error;

      toast.success(`Document classified as ${DOCUMENT_TYPES.find(t => t.value === selectedType)?.label}`);
      onClassified();
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Select value={selectedType} onValueChange={setSelectedType} disabled={loading}>
        <SelectTrigger className="w-[200px] h-8 text-sm">
          <SelectValue placeholder="Select document type..." />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex flex-col">
                <span className="font-medium">{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        onClick={handleConfirm}
        disabled={!selectedType || loading}
        className="h-8"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <Check className="h-3 w-3 mr-2" />
            Confirm Type
          </>
        )}
      </Button>
    </div>
  );
}