export interface TabConfig {
  id: string;
  title: string;
  description: string;
  centerpieceVideoUrl: string;
  icon: string;
}

export const TAB_MANIFEST: Record<string, TabConfig> = {
  overall: {
    id: "overall",
    title: "Overall Progress",
    description: "Comprehensive view of all progress metrics",
    centerpieceVideoUrl: "/animations/overall-progress.mp4",
    icon: "activity"
  },
  behavioral: {
    id: "behavioral",
    title: "Behavioral",
    description: "Behavior patterns, triggers, and intervention effectiveness",
    centerpieceVideoUrl: "/animations/behavioral.mp4",
    icon: "brain"
  },
  academic: {
    id: "academic",
    title: "Academic & Cognitive",
    description: "Academic performance, fluency trends, and cognitive skills",
    centerpieceVideoUrl: "/animations/academic.mp4",
    icon: "book-open"
  },
  social: {
    id: "social",
    title: "Social & Communication",
    description: "Social interactions, communication progress, and peer relationships",
    centerpieceVideoUrl: "/animations/social.mp4",
    icon: "users"
  },
  sensory: {
    id: "sensory",
    title: "Executive & Sensory",
    description: "Executive function, sensory profiles, and physiological data",
    centerpieceVideoUrl: "/animations/sensory.mp4",
    icon: "waves"
  }
};

export const TAB_ORDER = ["overall", "behavioral", "academic", "social", "sensory"];
