import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBlogCategories } from '@/hooks/useBlogPosts';
import { useAIKnowledgeSources } from '@/hooks/useAIKnowledgeSources';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { EnhancedAIBlogWizard } from './EnhancedAIBlogWizard';

interface AIBlogWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WizardStep = 'topic' | 'sources' | 'outline' | 'generating';

export function AIBlogWizard({ open, onOpenChange }: AIBlogWizardProps) {
  // Render the enhanced wizard instead
  return <EnhancedAIBlogWizard open={open} onOpenChange={onOpenChange} />;
}
