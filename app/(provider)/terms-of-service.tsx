import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';
 
export default function TermsOfService(){
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
            fontWeight: "bold",
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms of Service
        </Text>

        <Text variant="bodyMedium" style={styles.lastUpdated}>
          Last updated: July 21, 2025
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Acceptance of Terms
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              By using this application ("Moggin"), you agree to these Terms of Service. If you do
              not agree to these terms, please do not use the app.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Description of Service
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Moggin is a dashboard application that displays your data from third-party services
              like WakaTime. The app acts as a read-only interface to view your existing data from
              these services.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              User Responsibilities
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              You are responsible for:{"\n"}• Keeping your API keys secure{"\n"}• Complying with the
              terms of service of third-party providers{"\n"}• Using the app in accordance with
              applicable laws{"\n"}• Not attempting to reverse engineer or modify the app
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Third-Party Services
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              This app integrates with third-party services. You must comply with their respective
              terms of service. We are not responsible for any issues arising from your use of
              third-party services.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Disclaimer
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              The app is provided "as is" without warranties of any kind. We do not guarantee the
              accuracy, completeness, or availability of data from third-party services.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Limitation of Liability
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              We shall not be liable for any direct, indirect, incidental, special, or consequential
              damages arising from your use of the app.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Changes to Terms
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              We may update these Terms of Service from time to time. Continued use of the app after
              changes constitutes acceptance of the new terms.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Contact
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us through the
              app's support channels.
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
