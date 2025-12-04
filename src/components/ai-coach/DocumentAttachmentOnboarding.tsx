import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface DocumentAttachmentOnboardingProps {
  hasUploadedDocument: boolean;
  isInChat: boolean;
}

const ONBOARDING_KEY = 'ai-coach-document-onboarding-completed';

export const DocumentAttachmentOnboarding: React.FC<DocumentAttachmentOnboardingProps> = ({
  hasUploadedDocument,
  isInChat
}) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    
    // Show onboarding after first upload OR when entering chat for the first time
    if (!hasSeenOnboarding && (hasUploadedDocument || isInChat)) {
      setTimeout(() => setRun(true), 1000); // Small delay to let UI settle
    }
  }, [hasUploadedDocument, isInChat]);

  const steps: Step[] = [
    {
      target: '[data-tour="upload-success-start-studying"]',
      content: (
        <div>
          <h3 className="font-semibold mb-2">📎 Attach Documents to Chat</h3>
          <p>Click <strong>"Start Studying This Now"</strong> to open Betty's chat with your document automatically attached so she can reference and discuss its content.</p>
        </div>
      ),
      disableBeacon: true,
      placement: 'bottom'
    },
    {
      target: '[data-tour="chat-attach-button"]',
      content: (
        <div>
          <h3 className="font-semibold mb-2">📎 Attach Documents Anytime</h3>
          <p>Use this paperclip button to manually attach any uploaded document to your conversation with Betty.</p>
        </div>
      ),
      placement: 'top'
    },
    {
      target: '[data-tour="attached-documents-badge"]',
      content: (
        <div>
          <h3 className="font-semibold mb-2">👀 See What's Attached</h3>
          <p>Your attached documents will appear here as badges. Betty can see and reference everything you attach!</p>
        </div>
      ),
      placement: 'bottom'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }

    setStepIndex(index);
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#9333ea', // Purple color
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 8,
        },
        buttonNext: {
          backgroundColor: '#9333ea',
        },
        buttonBack: {
          color: '#9333ea',
        }
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Got it!',
        next: 'Next',
        skip: 'Skip tour'
      }}
    />
  );
};
