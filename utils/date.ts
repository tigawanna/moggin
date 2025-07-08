export function getLastFiveDates(startingFrom: Date): string[] {
  const lastFiveDates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(startingFrom);
    date.setDate(startingFrom.getDate() - i);
    lastFiveDates.push(date.toISOString().split("T")[0]);
  }
  return lastFiveDates;
}
