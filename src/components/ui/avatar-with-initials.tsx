import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 16 | 20 | 24 | 32 | 40;
  className?: string;
}

export const UserAvatar = ({ name, avatarUrl, size = 32, className }: UserAvatarProps) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  const sizeClasses = {
    16: 'h-4 w-4 text-[8px]',
    20: 'h-5 w-5 text-[9px]',
    24: 'h-6 w-6 text-[10px]',
    32: 'h-8 w-8 text-xs',
    40: 'h-10 w-10 text-sm',
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: getColorFromName(name) }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
