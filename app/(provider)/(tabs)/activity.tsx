import { WakatimeWeeklyChart } from '@/components/screens/wakatime/WakatimeWeeklyChart';
import { useSettingsStore } from '@/stores/use-app-settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const { settings } = useSettingsStore();
  const { wakatimeApiKey } = settings;
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons name="chart-line" size={24} color={colors.primary} />
            <Text variant="titleLarge" style={styles.title}>
              Weekly Coding Activity
            </Text>
          </View>
          
          <Text variant="bodyMedium" style={styles.subtitle}>
            Your coding hours for the past 5 days
          </Text>

          <View style={styles.chartContainer}>
            <WakatimeWeeklyChart 
              selectedDate={selectedDate} 
              wakatimeApiKey={wakatimeApiKey} 
            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
});
