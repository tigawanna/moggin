import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';
 
export default function PrivacyPolicy(){
  const { colors } = useTheme();
  return (
    <Surface style={styles.container}>
        <Stack.Screen
            options={{
            title: "",
            headerBackTitle: "Settings",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            }}
        />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant='headlineMedium' style={styles.title}>Privacy Policy</Text>
        
        <Text variant='bodyMedium' style={styles.lastUpdated}>
          Last updated: July 21, 2025
        </Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>What We Do</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              This app is simply a dashboard that displays your existing data from third-party services like WakaTime. 
              We don't collect, store, or process any of your personal data on our servers.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Data Collection</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              • We do not collect any personal information{'\n'}
              • We do not store your API keys or credentials{'\n'}
              • We do not track your usage or behavior{'\n'}
              • We do not use analytics or tracking services
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Data Sharing</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              We do not share any data with third parties because we don't collect any data in the first place. 
              Your information stays between you and the original service providers (like WakaTime).
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Third-Party Services</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              This app connects directly to third-party services using your API keys:{'\n\n'}
              • WakaTime: For coding statistics and leaderboards{'\n'}
              • Other services as configured by you{'\n\n'}
              Please review the privacy policies of these services for information about how they handle your data.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Local Storage</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              Your API keys and app preferences are stored locally on your device only. 
              This data is never transmitted to our servers or any third parties.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Security</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              Since we don't collect data, there's no risk of your personal information being compromised through our services. 
              Your API keys are stored securely on your device using platform-standard encryption.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>Contact Us</Text>
            <Text variant='bodyMedium' style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us through the app's support channels.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdated: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    lineHeight: 20,
  },
})
