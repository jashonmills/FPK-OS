import React, { useEffect, useRef } from "react";

type Props = {
  launchUrl: string;       // absolute URL from scorm-content-proxy?pkg=...&path=...
  onLoaded?: () => void;
};

const ScormIframe: React.FC<Props> = ({ launchUrl, onLoaded }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    // Set src directly; do NOT fetch and inject text (which rendered source)
    iframeRef.current.src = launchUrl;

    const handleLoad = () => onLoaded?.();
    const el = iframeRef.current;
    el?.addEventListener("load", handleLoad);
    return () => el?.removeEventListener("load", handleLoad);
  }, [launchUrl, onLoaded]);

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
