import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen
        options={{ title: "Not Found", headerStyle: { backgroundColor: colors.surface } }}
      />
      <Surface style={styles.container}>
        <View style={styles.content}>
          <MaterialCommunityIcons 
            name="map-marker-question" 
            size={120} 
            color={colors.onSurfaceVariant} 
          />
          <Text variant="headlineMedium" style={styles.title}>
            Page Not Found
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            The page you&apos;re looking for doesn&apos;t exist.
          </Text>
          <Link href="/" asChild>
            <Button mode="contained" icon="home" style={styles.button}>
              Go Home
            </Button>
          </Link>
        </View>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
});
