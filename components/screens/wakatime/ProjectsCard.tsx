import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, ProgressBar, Text, useTheme } from 'react-native-paper';

interface ProjectsCardProps {
  projects: { name: string; total_seconds: number; percent: number }[] | null;
  loading: boolean;
  formatDuration: (seconds: number) => string;
}

export function ProjectsCard({ projects, loading, formatDuration }: ProjectsCardProps) {
  const { colors } = useTheme();

  const renderSkeletonProjects = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.breakdown}>
          <View style={styles.breakdownHeader}>
            <View style={[styles.skeleton, styles.skeletonName]} />
            <View style={[styles.skeleton, styles.skeletonTime]} />
          </View>
          <View style={[styles.skeleton, styles.skeletonProgress]} />
        </View>
      ))}
    </>
  );

  const shouldShowCard = loading || (projects && projects.length > 0);

  if (!shouldShowCard) return null;

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="folder-outline" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Projects
          </Text>
        </View>
        
        <View style={styles.projectsContainer}>
          {loading ? (
            renderSkeletonProjects()
          ) : projects && projects.length > 0 ? (
            projects.slice(0, 5).map((project, index) => (
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
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.loadingText}>
              No projects data available
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
  projectsContainer: {
    minHeight: 120, // Prevent layout shift
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
  skeletonName: {
    width: 120,
    height: 16,
  },
  skeletonTime: {
    width: 80,
    height: 14,
  },
  skeletonProgress: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
});
