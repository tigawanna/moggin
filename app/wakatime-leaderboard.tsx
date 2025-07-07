import { WakatimeLeaderboardScreen } from '@/components/screens/leaderboards/WakatimeLeaderboardScreen';
import { Stack } from 'expo-router';

export default function WakatimeLeaderboard() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Wakatime Leaderboard',
        headerBackTitle: 'Explore'
      }} />
      <WakatimeLeaderboardScreen />
    </>
  );
}
