import { supabase } from "@/integrations/supabase/client";

export interface ErrorLogData {
  errorType: 'document_upload_failure' | 'page_not_found' | 'api_error' | 'network_error' | 'auth_error' | 'unknown';
  errorCode?: string;
  errorMessage: string;
  userAction: string;
  contextData?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    route?: string;
    apiEndpoint?: string;
    [key: string]: any;
  };
  stackTrace?: string;
}

export const logError = async (data: ErrorLogData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get user's family context if available
    let familyId = null;
    if (user) {
      const { data: families } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      
      familyId = families?.family_id || null;
    }

    const { error } = await supabase
      .from('system_error_log')
      .insert({
        user_id: user?.id || null,
        family_id: familyId,
        error_type: data.errorType,
        error_code: data.errorCode,
        error_message: data.errorMessage,
        user_action: data.userAction,
        context_data: data.contextData || {},
        stack_trace: data.stackTrace,
        user_agent: navigator.userAgent,
      });

    if (error) {
      console.error('Failed to log error to database:', error);
    }
  } catch (err) {
    // Silently fail - we don't want error logging to break the app
    console.error('Error logger failed:', err);
  }
};

// Convenience method for document upload failures
export const logDocumentUploadFailure = (
  fileName: string,
  fileSize: number,
  fileType: string,
  errorMessage: string,
  errorCode?: string
) => {
  return logError({
    errorType: 'document_upload_failure',
    errorCode,
    errorMessage,
    userAction: 'Uploading document',
    contextData: {
      fileName,
      fileSize,
      fileType,
    },
  });
};

// Convenience method for 404 errors
export const log404Error = (route: string) => {
  return logError({
    errorType: 'page_not_found',
    errorCode: '404',
    errorMessage: `Page not found: ${route}`,
    userAction: 'Navigating to page',
    contextData: {
      route,
    },
  });
};

// Convenience method for API errors
export const logApiError = (
  endpoint: string,
  errorMessage: string,
  errorCode?: string,
  responseData?: any
) => {
  return logError({
    errorType: 'api_error',
    errorCode,
    errorMessage,
    userAction: 'Making API request',
    contextData: {
      apiEndpoint: endpoint,
      responseData,
    },
  });
};
