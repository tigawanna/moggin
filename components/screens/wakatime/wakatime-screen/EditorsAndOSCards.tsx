import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface EditorsAndOSCardsProps {
  editors: { name: string; total_seconds: number; percent: number }[] | null;
  operatingSystems: { name: string; total_seconds: number; percent: number }[] | null;
  loading: boolean;
}

export function EditorsAndOSCards({ editors, operatingSystems, loading }: EditorsAndOSCardsProps) {
  const { colors } = useTheme();

  const renderSkeletonMiniStats = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.miniStat}>
          <View style={[styles.skeleton, styles.skeletonName]} />
          <View style={[styles.skeleton, styles.skeletonPercent]} />
        </View>
      ))}
    </>
  );

  const shouldShowEditorsCard = loading || (editors && editors.length > 0);
  const shouldShowOSCard = loading || (operatingSystems && operatingSystems.length > 0);

  if (!shouldShowEditorsCard && !shouldShowOSCard) return null;

  return (
    <View style={styles.twoColumnContainer}>
      {/* Editors */}
      {shouldShowEditorsCard && (
        <Card style={styles.halfCard} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="application-edit-outline" size={20} color={colors.primary} />
              <Text variant="titleSmall" style={styles.cardTitle}>
                Editors
              </Text>
            </View>
            
            <View style={styles.miniStatsContainer}>
              {loading ? (
                renderSkeletonMiniStats()
              ) : editors && editors.length > 0 ? (
                editors.slice(0, 3).map((editor, index) => (
                  <View key={index} style={styles.miniStat}>
                    <Text variant="bodySmall" style={styles.miniStatName}>
                      {editor.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.miniStatPercent}>
                      {editor.percent.toFixed(1)}%
                    </Text>
                  </View>
                ))
              ) : (
                <Text variant="bodySmall" style={styles.loadingText}>
                  No data
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Operating Systems */}
      {shouldShowOSCard && (
        <Card style={styles.halfCard} mode="elevated">
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="monitor" size={20} color={colors.primary} />
              <Text variant="titleSmall" style={styles.cardTitle}>
                OS
              </Text>
            </View>
            
            <View style={styles.miniStatsContainer}>
              {loading ? (
                renderSkeletonMiniStats()
              ) : operatingSystems && operatingSystems.length > 0 ? (
                operatingSystems.slice(0, 3).map((os, index) => (
                  <View key={index} style={styles.miniStat}>
                    <Text variant="bodySmall" style={styles.miniStatName}>
                      {os.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.miniStatPercent}>
                      {os.percent.toFixed(1)}%
                    </Text>
                  </View>
                ))
              ) : (
                <Text variant="bodySmall" style={styles.loadingText}>
                  No data
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  halfCard: {
    flex: 1,
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
  miniStatsContainer: {
    minHeight: 80, // Prevent layout shift
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
    fontSize: 12,
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    opacity: 0.6,
  },
  skeletonName: {
    width: 60,
    height: 12,
  },
  skeletonPercent: {
    width: 30,
    height: 12,
  },
});
