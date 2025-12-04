import { cn } from '@/lib/utils';

interface UserAvatarProps {
  fullName: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

export const UserAvatar = ({ fullName, avatarUrl, size = 32, className }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
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

  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(8, size / 3)}px`,
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={cn('rounded-full object-cover', className)}
        style={sizeStyle}
      />
    );
  }

  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-medium text-white', className)}
      style={{ ...sizeStyle, backgroundColor: getColorFromName(fullName) }}
      title={fullName}
    >
      {getInitials(fullName)}
    </div>
  );
};
