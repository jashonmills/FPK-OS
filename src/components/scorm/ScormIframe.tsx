import React, { useEffect, useRef } from "react";
import { useCleanup } from '@/utils/cleanupManager';

type Props = {
  launchUrl: string;       // absolute URL from scorm-content-proxy?pkg=...&path=...
  onLoaded?: () => void;
};

const ScormIframe: React.FC<Props> = ({ launchUrl, onLoaded }) => {
  const cleanup = useCleanup('ScormIframe');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !launchUrl) return;
    
    console.log('🎯 ScormIframe loading URL:', launchUrl);
    
    // Load the URL directly without resetting
    iframeRef.current.src = launchUrl;

    const handleLoad = () => {
      console.log('✅ ScormIframe loaded successfully');
      onLoaded?.();
    };
    
    const handleError = () => {
      console.error('❌ ScormIframe failed to load');
    };
    
    const el = iframeRef.current;
    if (el) {
      cleanup.addEventListener(el, "load", handleLoad);
      cleanup.addEventListener(el, "error", handleError);
    }
  }, [launchUrl, onLoaded, cleanup]);

  return (
    <iframe
      ref={iframeRef}
      title="SCORM Content"
      className="w-full h-full rounded-lg bg-white"
      // Important: allow scripts/forms/popups; keep same-origin so API wrappers can read window
      sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
      allow="autoplay; microphone; camera"
      // Never use srcDoc here; we want the proxy URL
      src={launchUrl}
    />
  );
};

export default ScormIframe;
