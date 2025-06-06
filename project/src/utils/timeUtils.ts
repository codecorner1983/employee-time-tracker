export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const calculateWorkTime = (clockIn: Date, clockOut?: Date): number => {
  if (!clockOut) return 0;
  return Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60));
};

export const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTimeElapsed = (startTime: Date): string => {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  return formatDuration(minutes);
};