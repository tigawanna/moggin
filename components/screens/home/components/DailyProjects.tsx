import { UserDailyDurationsData } from '@/lib/api/wakatime/types/current-user-types';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Surface, Text } from 'react-native-paper';


interface DailyProjectsProps {
  projects: UserDailyDurationsData[];
}

export function DailyProjects({ projects }: DailyProjectsProps){
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderProjectItem = ({ item }: { item: UserDailyDurationsData }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.projectName}>
          {item.project}
        </Text>
        <Text variant="bodyMedium" style={styles.duration}>
          {formatDuration(item.duration)}
        </Text>
        {item.color && (
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
        )}
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={styles.container}>
      <Text variant='titleLarge' style={styles.title}>
        Daily Projects
      </Text>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item, index) => `${item.project}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  projectCard: {
    marginBottom: 8,
    elevation: 2,
  },
  projectName: {
    fontWeight: 'bold',
  },
  duration: {
    marginTop: 4,
    opacity: 0.7,
  },
  colorIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
