interface VideoBackgroundProps {
  opacity?: number;
}

export const VideoBackground = ({ opacity = 0.3 }: VideoBackgroundProps) => {
  return (
    <video
      className="fixed top-0 left-0 w-full h-full object-cover"
      style={{ 
        zIndex: 1,
        opacity: opacity
      }}
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/videos/mission-control-bg.mp4" type="video/mp4" />
    </video>
  );
};
