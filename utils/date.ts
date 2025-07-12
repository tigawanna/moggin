export function getLastFiveDates(startingFrom: Date): string[] {
  const lastFiveDates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(startingFrom);
    date.setDate(startingFrom.getDate() - i);
    lastFiveDates.push(date.toISOString().split("T")[0]);
  }
  return lastFiveDates;
}

export function formatWakatimeDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function formatWakatimeMsToHumanReadable(ms: number): string {
  const date = new Date(ms * 1000); // Assuming ms is timestamp in seconds

  // Format to a readable date string
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};
