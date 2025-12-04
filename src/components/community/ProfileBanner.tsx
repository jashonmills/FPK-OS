import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileBannerProps {
  bannerUrl?: string | null;
  displayName: string;
  avatarUrl?: string | null;
  className?: string;
}

const defaultGradients = [
  'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
  'linear-gradient(135deg, hsl(262.1 83.3% 57.8%) 0%, hsl(270 100% 70%) 100%)',
  'linear-gradient(135deg, hsl(220 90% 60%) 0%, hsl(280 80% 65%) 100%)',
];

export const ProfileBanner = ({
  bannerUrl,
  displayName,
  avatarUrl,
  className = "",
}: ProfileBannerProps) => {
  const randomGradient = defaultGradients[Math.floor(Math.random() * defaultGradients.length)];

  return (
    <div 
      className={`relative h-40 md:h-48 w-full overflow-hidden border-b border-border ${className}`}
      style={{
        background: bannerUrl ? `url(${bannerUrl})` : randomGradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      
      <div className="absolute bottom-4 left-4 md:left-6 flex items-center gap-3 md:gap-4">
        <Avatar className="h-14 w-14 md:h-16 md:w-16 ring-4 ring-background">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="text-lg md:text-xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground drop-shadow-lg">
            {displayName}
          </h2>
        </div>
      </div>
    </div>
  );
};
