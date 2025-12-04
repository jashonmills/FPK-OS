import { EmptyState } from '@/components/shared/EmptyState';
import { FileText } from 'lucide-react';

interface DocumentsEmptyStateProps {
  onUpload: () => void;
}

export const DocumentsEmptyState = ({ onUpload }: DocumentsEmptyStateProps) => {
  return (
    <EmptyState
      icon={FileText}
      title="Your Secure Document Hub"
      description="This is where you can upload, store, and analyze all your child's important documents—like IEPs, diagnostic evaluations, and therapy reports. Our AI can help you extract key insights and goals from these files."
      actionLabel="Upload Your First Document"
      onAction={onUpload}
    />
  );
};
