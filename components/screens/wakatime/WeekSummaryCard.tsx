import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface WeekSummaryCardProps {
  stats: {
    human_readable_total: string;
    daily_average: string;
  } | null;
  loading: boolean;
}

export function WeekSummaryCard({ stats, loading }: WeekSummaryCardProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="calendar-week" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            This Week
          </Text>
        </View>
        
        <View style={styles.weekContainer}>
          {loading ? (
            <>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={styles.statLabel}>Total:</Text>
                <View style={[styles.skeleton, styles.skeletonStat]} />
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={styles.statLabel}>Daily Average:</Text>
                <View style={[styles.skeleton, styles.skeletonStat]} />
              </View>
            </>
          ) : stats ? (
            <>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={styles.statLabel}>Total:</Text>
                <Text variant="bodyMedium" style={styles.statValue}>
                  {stats.human_readable_total}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text variant="bodyMedium" style={styles.statLabel}>Daily Average:</Text>
                <Text variant="bodyMedium" style={styles.statValue}>
                  {stats.daily_average}
                </Text>
              </View>
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.loadingText}>
              No data for this week
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
  weekContainer: {
    gap: 8,
    minHeight: 60, // Prevent layout shift
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    flex: 1,
  },
  statValue: {
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    opacity: 0.6,
  },
  skeletonStat: {
    width: 80,
    height: 16,
  },
});
