import { GitHubScreen } from '@/components/screens/github/GitHubScreen';
import { Stack } from 'expo-router';

export default function GitHub() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'GitHub Details',
        headerBackTitle: 'Home'
      }} />
      <GitHubScreen />
    </>
  );
}
