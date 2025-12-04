import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface TourPopupProps {
  title: string;
  content: string;
  targetElementSelector?: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  onNext: () => void;
  onSkip: () => void;
  nextButtonText?: string;
  hideNextButton?: boolean;
}

export const TourPopup = ({
  title,
  content,
  targetElementSelector,
  placement = "bottom",
  onNext,
  onSkip,
  nextButtonText = "Next",
  hideNextButton = false,
}: TourPopupProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetElementSelector || placement === "center") return;

    const updatePosition = () => {
      const targetElement = document.querySelector(targetElementSelector);
      if (!targetElement || !popupRef.current) return;

      const targetRect = targetElement.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const padding = 16;

      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = targetRect.top - popupRect.height - padding;
          left = targetRect.left + (targetRect.width - popupRect.width) / 2;
          break;
        case "bottom":
          top = targetRect.bottom + padding;
          left = targetRect.left + (targetRect.width - popupRect.width) / 2;
          break;
        case "left":
          top = targetRect.top + (targetRect.height - popupRect.height) / 2;
          left = targetRect.left - popupRect.width - padding;
          break;
        case "right":
          top = targetRect.top + (targetRect.height - popupRect.height) / 2;
          left = targetRect.right + padding;
          break;
      }

      // Ensure popup stays within viewport
      const maxLeft = window.innerWidth - popupRect.width - padding;
      const maxTop = window.innerHeight - popupRect.height - padding;
      
      left = Math.max(padding, Math.min(left, maxLeft));
      top = Math.max(padding, Math.min(top, maxTop));

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [targetElementSelector, placement]);

  useEffect(() => {
    if (!targetElementSelector) return;

    const targetElement = document.querySelector(targetElementSelector);
    if (!targetElement) return;

    // Highlight the target element
    targetElement.classList.add("tour-highlight");

    return () => {
      targetElement.classList.remove("tour-highlight");
    };
  }, [targetElementSelector]);

  const isCentered = !targetElementSelector || placement === "center";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[9998] animate-fade-in" />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`fixed z-[9999] w-full max-w-md animate-fade-in ${
          isCentered ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : ""
        }`}
        style={
          isCentered
            ? {}
            : {
                top: `${position.top}px`,
                left: `${position.left}px`,
              }
        }
      >
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkip}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-base mt-2">
              {content}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Tour
            </Button>
            {!hideNextButton && (
              <Button onClick={onNext} size="sm">
                {nextButtonText}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add global styles for highlighting */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 9999 !important;
          box-shadow: 0 0 0 4px hsl(var(--primary)), 0 0 30px 10px hsl(var(--primary) / 0.3) !important;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};
