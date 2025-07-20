import { UserDailyDurationsData } from '@/lib/api/wakatime/types/current-user-types';
import { formatWakatimeDuration } from '@/utils/date';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

type WakatimeWeeklyData = {
  readonly type: "success";
  readonly date: string;
  readonly todayHours: `${number}h ${number}m`;
  readonly totalDurations: number;
  readonly currentProject: string;
  readonly groupedProjects: UserDailyDurationsData[];
  readonly allProjects: UserDailyDurationsData[];
}[];

interface WeeklyStatsCardsProps {
  wakatimeData: WakatimeWeeklyData | null;
}

export function WeeklyStatsCards({ wakatimeData }: WeeklyStatsCardsProps) {
  const { colors } = useTheme();

  if (!wakatimeData || wakatimeData.length === 0) {
    return null;
  }

  // Aggregate weekly statistics
  const weeklyStats = React.useMemo(() => {
    // Total coding time across all days
    const totalSeconds = wakatimeData.reduce((total, day) => {
      const daySeconds = day.groupedProjects.reduce((dayTotal, project) => 
        dayTotal + project.duration, 0);
      return total + daySeconds;
    }, 0);

    // Most productive day
    const mostProductiveDay = wakatimeData.reduce((max, day) => {
      const daySeconds = day.groupedProjects.reduce((dayTotal, project) => 
        dayTotal + project.duration, 0);
      const maxSeconds = max.groupedProjects.reduce((dayTotal, project) => 
        dayTotal + project.duration, 0);
      return daySeconds > maxSeconds ? day : max;
    });

    // Top projects across the week
    const allProjects = wakatimeData.flatMap(day => day.groupedProjects);
    const projectTotals = allProjects.reduce((acc, project) => {
      acc[project.project] = (acc[project.project] || 0) + project.duration;
      return acc;
    }, {} as Record<string, number>);

    const topProjects = Object.entries(projectTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Average daily coding time
    const averageDaily = totalSeconds / wakatimeData.length;

    // Total number of projects worked on
    const uniqueProjects = new Set(allProjects.map(p => p.project)).size;

    // Days with coding activity
    const activeDays = wakatimeData.filter(day => 
      day.groupedProjects.reduce((total, project) => total + project.duration, 0) > 0
    ).length;

    return {
      totalTime: totalSeconds,
      averageDaily,
      mostProductiveDay,
      topProjects,
      uniqueProjects,
      activeDays,
      totalDays: wakatimeData.length
    };
  }, [wakatimeData]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = colors.primary 
  }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <Card style={styles.statCard} elevation={4}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={icon as any} size={24} color={color} />
          <Text variant="labelMedium" style={[styles.cardTitle, { color: color }]}>
            {title}
          </Text>
        </View>
        <Text variant="headlineSmall" style={styles.cardValue}>
          {value}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.cardSubtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Weekly Summary
      </Text>

      {/* Most Productive Day Card */}
      <Card style={styles.fullWidthCard} elevation={4}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="trophy" size={24} color={colors.primary} />
            <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.primary }]}>
              Most Productive Day
            </Text>
          </View>
          <View style={styles.productiveDayContent}>
            <Text variant="headlineSmall" style={styles.cardValue}>
              {new Date(weeklyStats.mostProductiveDay.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Text variant="bodyLarge" style={styles.productiveDayTime}>
              {formatWakatimeDuration(
                weeklyStats.mostProductiveDay.groupedProjects.reduce(
                  (total, project) => total + project.duration,
                  0
                )
              )}{" "}
              coding time
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Row 1: Total Time and Average */}
      <View style={styles.row}>
        <StatCard
          title="Total Time"
          value={formatWakatimeDuration(weeklyStats.totalTime)}
          subtitle="This week"
          icon="clock-outline"
          color={colors.primary}
        />
        <StatCard
          title="Daily Average"
          value={formatWakatimeDuration(weeklyStats.averageDaily)}
          subtitle="Per day"
          icon="chart-line"
          color={colors.secondary}
        />
      </View>

      {/* Row 2: Active Days and Projects */}
      <View style={styles.row}>
        <StatCard
          title="Active Days"
          value={`${weeklyStats.activeDays}/${weeklyStats.totalDays}`}
          subtitle="Days with coding"
          icon="calendar-check"
          color={colors.tertiary}
        />
        <StatCard
          title="Projects"
          value={weeklyStats.uniqueProjects.toString()}
          subtitle="Unique projects"
          icon="folder-multiple"
          color={colors.error}
        />
      </View>

      {/* Top Projects Card */}
      <Card style={styles.fullWidthCard} elevation={4}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="star" size={24} color={colors.secondary} />
            <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.secondary }]}>
              Top Projects This Week
            </Text>
          </View>
          <View style={styles.projectsList}>
            {weeklyStats.topProjects.map(([project, duration], index) => (
              <View key={project} style={styles.projectItem}>
                <View style={styles.projectRank}>
                  <Text variant="labelSmall" style={styles.rankText}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.projectInfo}>
                  <Text variant="bodyMedium" style={styles.projectName}>
                    {project}
                  </Text>
                  <Text variant="bodySmall" style={styles.projectTime}>
                    {formatWakatimeDuration(duration)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    minHeight: 400,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardContent: {
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  cardValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    opacity: 0.7,
  },
  productiveDayContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  productiveDayTime: {
    opacity: 0.8,
    marginTop: 4,
  },
  projectsList: {
    gap: 12,
    marginTop: 8,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  projectRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: 'bold',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontWeight: '500',
  },
  projectTime: {
    opacity: 0.7,
    marginTop: 2,
  },
});
