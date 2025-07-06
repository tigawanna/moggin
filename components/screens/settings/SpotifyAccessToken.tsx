import { useSnackbar } from "@/components/shared/snackbar/store";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { EvilIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";

export function SpotifyAccessToken() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const { spotifyAccessToken, setSpotifyAccessToken } = useApiKeysStore();
  const [spotifyToken, setSpotifyToken] = useState(spotifyAccessToken || "");
  const [spotifySecure, setSpotifySecure] = useState(true);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      // Your mutation logic here
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ token });
        }, 2000); // Simulate a network request
      });
    },

    onSuccess: (data, { token }) => {
      setSpotifyAccessToken(token);
      showSnackbar("Spotify access token saved", {
        duration: 5000,
        action: {
          label: "Undo",
          onPress: () => {
            console.log("Undo reset");
          },
        },
        onDismiss: () => {
          console.log("Snackbar dismissed");
        },
      });
    },
    onError(error, variables, context) {
      showSnackbar("Error saving Spotify access token", {
        duration: 5000,
        action: {
          label: "Retry",
          onPress: () => {
            mutate({ token: variables.token });
          },
        },
        onDismiss: () => {
          console.log("Snackbar dismissed");
        },
      });
    },
  });

  const handleSaveSpotify = () => {
    mutate({ token: spotifyToken.trim() });
  };

  return (
    <Surface style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}>
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Spotify
          </Text>

          {/* Replace HelperText with regular Text to avoid animation conflicts */}
          <Text
            variant="bodySmall"
            style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
            Used to fetch your music listening activity and statistics
          </Text>

          <Link
            target="_blank"
            href={"https://developer.spotify.com/documentation/web-api"}
            style={[styles.link, { textDecorationColor: theme.colors.primary }]}>
            <Text variant="bodySmall">• Spotify: Create app in Developer Dashboard</Text>
            <EvilIcons name="external-link" size={20} color={theme.colors.primary} />
          </Link>

          <TextInput
            mode="outlined"
            label="Spotify Access Token"
            value={spotifyToken}
            onChangeText={setSpotifyToken}
            secureTextEntry={spotifySecure}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={spotifySecure ? "eye" : "eye-off"}
                onPress={() => setSpotifySecure(!spotifySecure)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleSaveSpotify}
            style={styles.button}
            icon="content-save"
            disabled={isPending}>
            {isPending ? "Saving..." : "Save Spotify Token"}
            {isPending && (
              <ActivityIndicator
                size="small"
                color={theme.colors.onPrimary}
                style={{ marginLeft: 8 }}
              />
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    opacity: 0.7,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 8,
    paddingVertical: 8,
    textDecorationLine: "underline",
  },
  input: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
