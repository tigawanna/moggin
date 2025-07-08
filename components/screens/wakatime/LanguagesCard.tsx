import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';

interface LanguagesCardProps {
  languages: { name: string; total_seconds: number; percent: number }[] | null;
  loading: boolean;
}

export function LanguagesCard({ languages, loading }: LanguagesCardProps) {
  const { colors } = useTheme();

  const renderSkeletonChips = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={[styles.skeleton, styles.skeletonChip]} />
      ))}
    </>
  );

  const shouldShowCard = loading || (languages && languages.length > 0);

  if (!shouldShowCard) return null;

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="code-tags" size={24} color={colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Languages
          </Text>
        </View>
        
        <View style={styles.chipsContainer}>
          {loading ? (
            renderSkeletonChips()
          ) : languages && languages.length > 0 ? (
            languages.slice(0, 8).map((language, index) => (
              <Chip 
                key={index} 
                elevation={2}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {language.name} ({language.percent.toFixed(1)}%)
              </Chip>
            ))
          ) : (
            <Text variant="bodyMedium" style={styles.loadingText}>
              No languages data available
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 80, // Prevent layout shift
  },
  chip: {
    marginBottom: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    opacity: 0.6,
  },
  skeletonChip: {
    width: 100,
    height: 32,
    marginBottom: 8,
  },
});
