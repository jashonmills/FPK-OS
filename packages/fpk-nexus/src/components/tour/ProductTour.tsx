import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TourPopup } from "./TourPopup";
import { toast } from "sonner";

interface TourStep {
  step: number;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  targetElementSelector?: string;
  nextButtonText?: string;
  hideNextButton?: boolean;
  waitForUserAction?: {
    type: "click" | "state-change";
    selector?: string;
    stateCheck?: () => boolean;
  };
}

interface ProductTourProps {
  selectedCircleId: string | null;
}

export const ProductTour = ({ selectedCircleId }: ProductTourProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  const tourSteps: TourStep[] = [
    {
      step: 0,
      title: "Welcome to FPK Nexus!",
      content: "Let's take a quick tour to help you get started. This will only take a minute.",
      placement: "center",
      nextButtonText: "Start Tour",
    },
    {
      step: 1,
      title: "Your Circles",
      content: "This is your main navigation. You can switch between different community spaces, called 'Circles,' here.",
      targetElementSelector: "#circle-list-sidebar",
      placement: "right",
    },
    {
      step: 2,
      title: "The Community Feed",
      content: "This is where you'll see all the posts and conversations for the circle you've selected.",
      targetElementSelector: "#main-content-feed",
      placement: "left",
    },
    {
      step: 3,
      title: "Let's Get Started!",
      content: "The best way to start is by introducing yourself. Click on the 'Introductions' circle to continue.",
      targetElementSelector: "#circle-introductions",
      placement: "right",
      hideNextButton: true,
    },
    {
      step: 4,
      title: "Introduce Yourself",
      content: "Great! Now, use this box to write a short introduction. Don't be shy! When you're done, click 'Post'.",
      targetElementSelector: "#post-composer",
      placement: "top",
      nextButtonText: "Got it!",
    },
    {
      step: 5,
      title: "You're All Set!",
      content: "You've learned the basics. You're now ready to explore the community. Welcome aboard!",
      placement: "center",
      nextButtonText: "Explore FPK Nexus",
    },
  ];

  useEffect(() => {
    checkTourStatus();
  }, [user]);

  // Watch for circle selection on step 3
  useEffect(() => {
    if (currentStep === 3 && selectedCircleId) {
      // Check if the selected circle is the Introductions circle
      checkIfIntroductionsCircle(selectedCircleId);
    }
  }, [selectedCircleId, currentStep]);

  const checkIfIntroductionsCircle = async (circleId: string) => {
    const { data } = await supabase
      .from("circles")
      .select("name")
      .eq("id", circleId)
      .single();

    if (data?.name === "Introductions") {
      setTimeout(() => {
        setCurrentStep(4);
      }, 500);
    }
  };

  const checkTourStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("has_completed_tour")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error checking tour status:", error);
        return;
      }

      if (data && !data.has_completed_tour) {
        // Wait a bit before showing tour to let the page load
        setTimeout(() => {
          setIsTourActive(true);
        }, 1000);
      } else {
        setHasCompletedTour(true);
      }
    } catch (error) {
      console.error("Error in checkTourStatus:", error);
    }
  };

  const completeTour = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke("complete-product-tour");

      if (error) {
        console.error("Error completing tour:", error);
        toast.error("Failed to save tour progress");
        return;
      }

      setHasCompletedTour(true);
      setIsTourActive(false);
      toast.success("Welcome to FPK Nexus!");
    } catch (error) {
      console.error("Error in completeTour:", error);
      toast.error("Failed to save tour progress");
    }
  };

  const handleNext = () => {
    if (currentStep === tourSteps.length - 1) {
      completeTour();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  if (!isTourActive || hasCompletedTour) {
    return null;
  }

  const currentTourStep = tourSteps[currentStep];

  return (
    <TourPopup
      title={currentTourStep.title}
      content={currentTourStep.content}
      targetElementSelector={currentTourStep.targetElementSelector}
      placement={currentTourStep.placement}
      onNext={handleNext}
      onSkip={handleSkip}
      nextButtonText={currentTourStep.nextButtonText}
      hideNextButton={currentTourStep.hideNextButton}
    />
  );
};
