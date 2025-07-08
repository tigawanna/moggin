import { WakatimeLeaderboardScreen } from '@/components/screens/leaderboards/WakatimeLeaderboardScreen';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function WakatimeLeaderboard() {
    const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Wakatime Leaderboard',
        headerBackTitle: 'Explore',
        headerStyle: {
            backgroundColor: colors.surface,
          },
      }} />
      <WakatimeLeaderboardScreen />
    </>
  );
}
