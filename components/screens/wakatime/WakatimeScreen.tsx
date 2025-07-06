import { WakatimeSDK } from '@/lib/api/wakatime/wakatime-sdk';
import { useApiKeysStore } from '@/stores/use-app-settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, ProgressBar, Surface, Text, useTheme } from 'react-native-paper';

type WakatimeDetailStats = {
  todayStats: {
    total_seconds: number;
    human_readable_total: string;
    projects: { name: string; total_seconds: number; percent: number }[];
    languages: { name: string; total_seconds: number; percent: number }[];
    editors: { name: string; total_seconds: number; percent: number }[];
    operating_systems: { name: string; total_seconds: number; percent: number }[];
  } | null;
  weekStats: {
    human_readable_total: string;
    daily_average: string;
  } | null;
};

export function WakatimeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { wakatimeApiKey } = useApiKeysStore();
  
  const [stats, setStats] = useState<WakatimeDetailStats>({ todayStats: null, weekStats: null });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWakatimeDetails = useCallback(async () => {
    if (!wakatimeApiKey) return;
    
    try {
      const sdk = new WakatimeSDK(wakatimeApiKey);
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [todayResponse, weekResponse] = await Promise.all([
        sdk.getUserStats({ start: today, end: today }),
        sdk.getUserStats({ start: weekAgo, end: today })
      ]);
      
      setStats({
        todayStats: todayResponse.data,
        weekStats: weekResponse.data
      });
    } catch (error) {
      console.error('Failed to fetch Wakatime details:', error);
    }
  }, [wakatimeApiKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWakatimeDetails();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWakatimeDetails();
      setLoading(false);
    };
    loadData();
  }, [fetchWakatimeDetails]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!wakatimeApiKey) {
    return (
      <Surface style={styles.container}>
        <View style={styles.noApiContainer}>
          <MaterialCommunityIcons name="key-outline" size={64} color={colors.onSurfaceVariant} />
          <Text variant="headlineSmall" style={styles.noApiTitle}>
            API Key Required
          </Text>
          <Text variant="bodyMedium" style={styles.noApiText}>
            Add your Wakatime API key in settings to view detailed statistics
          </Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/api-keys')}
            style={styles.settingsButton}
          >
            Go to Settings
          </Button>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Today's Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Today&apos;s Activity
              </Text>
            </View>
            
            {stats.todayStats ? (
              <View style={styles.summaryContainer}>
                <Text variant="headlineMedium" style={styles.totalTime}>
                  {stats.todayStats.human_readable_total}
                </Text>
                <Text variant="bodyMedium" style={styles.totalLabel}>
                  Total coding time today
                </Text>
              </View>
            ) : (
              <Text variant="bodyMedium" style={styles.loadingText}>
                {loading ? 'Loading today\'s stats...' : 'No data for today'}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Week Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="calendar-week" size={24} color={colors.primary} />
              <Text variant="titleMedium" style={styles.cardTitle}>
                This Week
              </Text>
            </View>
            
            {stats.weekStats ? (
              <View style={styles.weekContainer}>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Total:</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>
                    {stats.weekStats.human_readable_total}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Daily Average:</Text>
                  <Text variant="bodyMedium" style={styles.statValue}>
                    {stats.weekStats.daily_average}
                  </Text>
                </View>
              </View>
            ) : (
              <Text variant="bodyMedium" style={styles.loadingText}>
                {loading ? 'Loading week stats...' : 'No data for this week'}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Projects Breakdown */}
        {stats.todayStats?.projects && stats.todayStats.projects.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="folder-outline" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Projects
                </Text>
              </View>
              
              {stats.todayStats.projects.slice(0, 5).map((project, index) => (
                <View key={index} style={styles.breakdown}>
                  <View style={styles.breakdownHeader}>
                    <Text variant="bodyMedium" style={styles.breakdownName}>
                      {project.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.breakdownTime}>
                      {formatDuration(project.total_seconds)} ({project.percent.toFixed(1)}%)
                    </Text>
                  </View>
                  <ProgressBar progress={project.percent / 100} style={styles.progressBar} />
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Languages Breakdown */}
        {stats.todayStats?.languages && stats.todayStats.languages.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="code-tags" size={24} color={colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Languages
                </Text>
              </View>
              
              <View style={styles.chipsContainer}>
                {stats.todayStats.languages.slice(0, 8).map((language, index) => (
                  <Chip 
                    key={index} 
                    mode="outlined" 
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {language.name} ({language.percent.toFixed(1)}%)
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Editors & OS */}
        <View style={styles.twoColumnContainer}>
          {/* Editors */}
          {stats.todayStats?.editors && stats.todayStats.editors.length > 0 && (
            <Card style={styles.halfCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="application-edit-outline" size={20} color={colors.primary} />
                  <Text variant="titleSmall" style={styles.cardTitle}>
                    Editors
                  </Text>
                </View>
                
                {stats.todayStats.editors.slice(0, 3).map((editor, index) => (
                  <View key={index} style={styles.miniStat}>
                    <Text variant="bodySmall" style={styles.miniStatName}>
                      {editor.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.miniStatPercent}>
                      {editor.percent.toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Operating Systems */}
          {stats.todayStats?.operating_systems && stats.todayStats.operating_systems.length > 0 && (
            <Card style={styles.halfCard}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons name="monitor" size={20} color={colors.primary} />
                  <Text variant="titleSmall" style={styles.cardTitle}>
                    OS
                  </Text>
                </View>
                
                {stats.todayStats.operating_systems.slice(0, 3).map((os, index) => (
                  <View key={index} style={styles.miniStat}>
                    <Text variant="bodySmall" style={styles.miniStatName}>
                      {os.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.miniStatPercent}>
                      {os.percent.toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
    marginBottom: 16,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 8,
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
    paddingVertical: 16,
  },
  totalTime: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalLabel: {
    opacity: 0.7,
    marginTop: 4,
  },
  weekContainer: {
    gap: 8,
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
  breakdown: {
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownName: {
    flex: 1,
    fontWeight: '500',
  },
  breakdownTime: {
    opacity: 0.7,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
  },
  miniStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniStatName: {
    flex: 1,
  },
  miniStatPercent: {
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  noApiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noApiTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noApiText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  settingsButton: {
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 24,
  },
});
