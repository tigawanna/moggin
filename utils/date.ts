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
}

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
}

export function generateLastFiveDates(count: number = 5) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = date.toISOString().split("T")[0];
    const isToday = i === 0;
    const isYesterday = i === 1;

    let label = "";
    if (isToday) {
      label = "Today";
    } else if (isYesterday) {
      label = "Yesterday";
    } else {
      // Format as "Mon 8" or similar
      label = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      });
    }

    dates.push({
      value: dateString,
      label: label,
    });
  }

  return dates;
}

export function dateToDayHoursMinutesSeconds(date: Date): string {
  const day = date.getDate();
  if (day < 10) {
    return `0${day}d`;
  }
  const month = date.getMonth() + 1; // Months are zero-based
  if (month < 10) {
    return `0${month}m`;
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${day}/${month} ${hours}:${minutes}:${seconds}`;
}
