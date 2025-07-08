import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface TodayActivityCardProps {
  stats: {
    human_readable_total: string;
  } | null;
  loading: boolean;
}

export function TodayActivityCard({ stats, loading }: TodayActivityCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Today&apos;s Activity
          </Text>
        </View>
        
        <View style={styles.summaryContainer}>
          {loading ? (
            <>
              <View style={[styles.skeleton, styles.skeletonTime]} />
              <View style={[styles.skeleton, styles.skeletonLabel]} />
            </>
          ) : stats ? (
            <>
              <Text variant="headlineMedium" style={styles.totalTime}>
                {stats.human_readable_total}
              </Text>
              <Text variant="bodyMedium" style={styles.totalLabel}>
                Total coding time today
              </Text>
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.loadingText}>
              No data for today
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  summaryContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    minHeight: 120, // Prevent layout shift
  },
  totalTime: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 48,
  },
  totalLabel: {
    opacity: 0.7,
    marginTop: 8,
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  skeleton: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  skeletonTime: {
    width: 200,
    height: 48,
    marginBottom: 8,
  },
  skeletonLabel: {
    width: 150,
    height: 16,
  },
});
