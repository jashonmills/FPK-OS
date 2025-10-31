import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateInTimezones } from '@/lib/timezones';

interface TimezoneTimestampProps {
  date: Date | string;
  viewerTimezone?: string;
  posterTimezone?: string;
  posterName?: string;
}

export const TimezoneTimestamp = ({
  date,
  viewerTimezone = 'America/New_York',
  posterTimezone,
  posterName,
}: TimezoneTimestampProps) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  const { viewerTime, posterTime } = formatDateInTimezones(
    dateObj,
    viewerTimezone,
    posterTimezone
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-xs text-muted-foreground cursor-help">
            {relativeTime}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <div>
              <span className="font-medium">Your Time: </span>
              <span>{viewerTime}</span>
            </div>
            {posterTime && posterName && (
              <div>
                <span className="font-medium">{posterName}'s Time: </span>
                <span>{posterTime}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
