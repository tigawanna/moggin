import { WakatimeWeeklyChart } from '@/components/screens/weekly/components/WakatimeWeeklyChart';
import { WeeklyActivity } from '@/components/screens/weekly/WeeklyActivity';
import { useSettingsStore } from '@/stores/use-app-settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';

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
