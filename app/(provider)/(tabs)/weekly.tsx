import { WeeklyActivity } from '@/components/screens/weekly/WeeklyActivity';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WeeklyActivityScreen() {
    const { top } = useSafeAreaInsets();
return (
    <Surface style={[styles.container, { paddingTop: top }]}>
      <WeeklyActivity />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
