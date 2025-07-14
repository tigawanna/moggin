import { WeeklyActivity } from '@/components/screens/weekly/WeeklyActivity';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

export default function WeeklyActivityScreen() {
return (
    <Surface style={styles.container}>
      <WeeklyActivity />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
