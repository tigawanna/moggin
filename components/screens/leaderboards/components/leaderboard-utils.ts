export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return "trophy" as const;
    case 2:
      return "medal" as const;
    case 3:
      return "medal-outline" as const;
    default:
      return "medal" as const;
  }
};

export const getRankColor = (rank: number, primaryColor: string) => {
  switch (rank) {
    case 1:
      return "#FFD700"; // Gold
    case 2:
      return "#C0C0C0"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return primaryColor;
  }
};
