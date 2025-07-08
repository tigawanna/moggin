import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';

export function NoApiKeyCard() {
  const { colors } = useTheme();
  const router = useRouter();

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
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
});
