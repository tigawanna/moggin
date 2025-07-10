import { StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";

interface LeaderboardHeaderProps {
  selectedPeriod: 'week' | 'month' | 'year';
  setSelectedPeriod: (period: 'week' | 'month' | 'year') => void;
  currentUser: any;
}

export function LeaderboardHeader({ selectedPeriod, setSelectedPeriod, currentUser }: LeaderboardHeaderProps) {
  return (
    <>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>
          Wakatime Leaderboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Top coding time this {selectedPeriod}
          {currentUser?.location && ` in ${currentUser.location}`}
        </Text>
      </Surface>

      <Surface style={styles.periodSelector} elevation={0}>
        <View style={styles.periodButtons}>
          <Button
            mode={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('week')}
            style={styles.periodButton}
          >
            This Week
          </Button>
          <Button
            mode={selectedPeriod === 'month' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('month')}
            style={styles.periodButton}
          >
            This Month
          </Button>
          <Button
            mode={selectedPeriod === 'year' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('year')}
            style={styles.periodButton}
          >
            This Year
          </Button>
        </View>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  periodButton: {
    flex: 1,
  },
});
