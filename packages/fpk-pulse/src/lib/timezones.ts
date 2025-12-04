// Common IANA timezone list for dropdown
export const TIMEZONES = [
  { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
  { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time' },
  { value: 'America/Denver', label: '(GMT-07:00) Mountain Time' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time' },
  { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time' },
  { value: 'America/St_Johns', label: '(GMT-03:30) Newfoundland' },
  { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brazil' },
  { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Europe/Dublin', label: '(GMT+00:00) Dublin' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Paris' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
  { value: 'Europe/Rome', label: '(GMT+01:00) Rome' },
  { value: 'Europe/Athens', label: '(GMT+02:00) Athens' },
  { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
  { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Karachi', label: '(GMT+05:00) Karachi' },
  { value: 'Asia/Kolkata', label: '(GMT+05:30) India' },
  { value: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka' },
  { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'Asia/Seoul', label: '(GMT+09:00) Seoul' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
  { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
];

// Helper function to get current time in a specific timezone
export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch (error) {
    console.error('Error formatting time for timezone:', timezone, error);
    return 'Unknown';
  }
};

// Helper function to format a date in both viewer's and poster's timezone
export const formatDateInTimezones = (
  date: Date | string,
  viewerTimezone: string,
  posterTimezone?: string
): { viewerTime: string; posterTime?: string } => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const viewerTime = new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    timeZone: viewerTimezone,
  }).format(dateObj);

  if (posterTimezone && posterTimezone !== viewerTimezone) {
    const posterTime = new Intl.DateTimeFormat('en-US', {
      ...formatOptions,
      timeZone: posterTimezone,
    }).format(dateObj);
    return { viewerTime, posterTime };
  }

  return { viewerTime };
};
