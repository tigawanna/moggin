import { GitHubScreen } from '@/components/screens/github/GitHubScreen';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function GitHub() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen
        options={{
          title: "GitHub Details",
          headerBackTitle: "Home",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <GitHubScreen />
    </>
  );
}
