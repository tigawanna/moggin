import { WakatimeScreen } from '@/components/screens/wakatime/WakatimeScreen';
import { Stack } from 'expo-router';

export default function Wakatime() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Wakatime Details',
        headerBackTitle: 'Home'
      }} />
      <WakatimeScreen />
    </>
  );
}
