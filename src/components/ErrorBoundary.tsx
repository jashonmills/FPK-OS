import React from 'react';
import ErrorBoundaryUnified from './ErrorBoundaryUnified';
import { ErrorBoundaryProps } from '@/types/common';

// Legacy wrapper for backward compatibility
// @deprecated Use ErrorBoundaryUnified directly

const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  return <ErrorBoundaryUnified {...props} />;
};

export default ErrorBoundary;