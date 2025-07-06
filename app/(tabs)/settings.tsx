import { useSettingsStore, useThemeStore } from "@/stores/use-app-settings";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Divider, List, Switch } from "react-native-paper";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const {
    settings: { dynamicColors, toggleDynamicColors },
  } = useSettingsStore();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container]}>
      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
        />
        <List.Item
          title="Dynamic Colors"
          description="Use Material You color palette"
          left={(props) => <List.Icon {...props} icon="palette" />}
          right={() => <Switch value={dynamicColors} onValueChange={toggleDynamicColors} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>API Integrations</List.Subheader>
        <List.Item
          title="API Keys"
          description="Configure GitHub, Wakatime, and Spotify API keys"
          left={(props) => <List.Icon {...props} icon="key" />}
          onPress={() => router.push("/api-keys")}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Notifications</List.Subheader>
        <List.Item
          title="Push Notifications"
          description="Get notified about new transactions"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => <Switch disabled value={false} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Security</List.Subheader>
        <List.Item
          title="Biometric Authentication"
          description="Use fingerprint or face ID"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={() => <Switch disabled value={false} />}
        />
        <List.Item
          title="PIN Lock"
          description="Require PIN to open app"
          left={(props) => <List.Icon {...props} icon="lock" />}
          right={() => <Switch disabled value={false} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Data</List.Subheader>
        <List.Item
          title="Auto-Sync"
          description="Keep transactions up to date"
          left={(props) => <List.Icon {...props} icon="sync" />}
          right={() => <Switch disabled value={false} />}
        />
        <List.Item
          title="Clear Cache"
          description="Free up space on your device"
          left={(props) => <List.Icon {...props} icon="trash-can" />}
          onPress={() => {}}
        />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Terms of Service"
          left={(props) => <List.Icon {...props} icon="file-document" />}
          onPress={() => {}}
        />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {}}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listSubHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
