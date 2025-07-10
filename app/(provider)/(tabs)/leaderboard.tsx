import { WakatimeLeaderboardScreen } from '@/components/screens/leaderboards/WakatimeLeaderboardScreen';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

export default function LeaderboardScreen() {
  return (
    <Surface style={styles.container}>
      <WakatimeLeaderboardScreen />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
