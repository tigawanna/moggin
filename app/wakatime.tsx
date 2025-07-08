import { WakatimeScreen } from '@/components/screens/wakatime/wakatime-screen/WakatimeScreen';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function Wakatime() {
    const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Wakatime Details',
        headerBackTitle: 'Home',
        headerStyle: {
          backgroundColor: colors.surface,
        },
      }} />
      <WakatimeScreen />
    </>
  );
}
