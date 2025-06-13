
export const allowedTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/markdown',
  'text/csv',
  'application/rtf'
];

export const maxFileSize = 100 * 1024 * 1024; // 100MB

export const getFileTypeLabel = (fileType: string) => {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF',
    'text/plain': 'TXT',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'text/markdown': 'MD',
    'text/csv': 'CSV',
    'application/rtf': 'RTF'
  };
  return typeMap[fileType] || 'FILE';
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const simulateProgress = (
  uploadId: string, 
  duration: number = 5000,
  setProcessingProgress: React.Dispatch<React.SetStateAction<Record<string, number>>>
) => {
  const steps = 40;
  const interval = duration / steps;
  let currentStep = 0;

  const progressInterval = setInterval(() => {
    currentStep++;
    const progress = Math.min((currentStep / steps) * 85, 85);
    
    setProcessingProgress(prev => ({
      ...prev,
      [uploadId]: progress
    }));

    if (currentStep >= steps) {
      clearInterval(progressInterval);
    }
  }, interval);

  return progressInterval;
};
