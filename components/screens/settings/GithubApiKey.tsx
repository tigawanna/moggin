import { useSnackbar } from "@/components/shared/snackbar/store";
import { GitHubSDK } from "@/lib/api/github/github-sdk";
import { useApiKeysStore } from "@/stores/use-app-settings";
import { EvilIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";

export function GithubApiKey() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const { githubApiKey, setGithubApiKey } = useApiKeysStore();
  const [githubKey, setGithubKey] = useState(githubApiKey || "");
  const [githubSecure, setGithubSecure] = useState(true);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      // Your mutation logic here
      return GitHubSDK.checkIfTokenIsValid({
        token,
      });
    },

    onSuccess: (data, { token }) => {
      if (!data.isValid) {
        showSnackbar(data?.error ?? "Something went wrong", {
          duration: 5000, // 5 seconds
          action: {
            label: "Retry",
            onPress: () => {
              // Logic to retry
              mutate({ token });
            },
          },
          onDismiss: () => {
            console.log("Snackbar dismissed");
          },
        });
        return;
      }
      setGithubApiKey(token);
      showSnackbar("GitHub API key saved", {
        duration: 5000, // 5 seconds
        action: {
          label: "Undo",
          onPress: () => {
            // Logic to undo the reset
            console.log("Undo reset");
          },
        },
        onDismiss: () => {
          console.log("Snackbar dismissed");
        },
      });
    },
    onError(error, variables, context) {
      showSnackbar("Error saving GitHub API key", {
        duration: 5000, // 5 seconds
        action: {
          label: "Undo",
          onPress: () => {
            // Logic to undo the reset
            console.log("Undo reset");
          },
        },
        onDismiss: () => {
          console.log("Snackbar dismissed");
        },
      });
    },
  });

  const handleSaveGithub = () => {
    mutate({ token: githubKey.trim() });
  };

  return (
    <Surface style={{ ...styles.container }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        <View style={{ marginBottom: 24 }}>
          <Text
            variant="titleMedium"
            style={{
              fontWeight: "bold",
            }}>
            GitHub Personal Access Token
          </Text>
          <Text 
            variant="bodySmall" 
            style={{
              fontSize: 12,
              paddingVertical: 4,
              paddingHorizontal: 12,
              opacity: 0.7,
              color: colors.onSurfaceVariant
            }}>
            Used to fetch your repositories and activity data
          </Text>
          <Link
            target="_blank"
            href={"https://github.com/settings/tokens"}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "99%",
              maxWidth: "99%",
              gap: 8,
              paddingVertical: 4,
              textDecorationLine: "underline",
              textDecorationColor: colors.inversePrimary,
            }}>
            <Text
              variant="bodySmall"
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}>
              GitHub: Go to Settings →
            </Text>
            <Text variant="bodySmall">Developer Settings →</Text>
            <Text variant="bodySmall">Personal access tokens</Text>
            <EvilIcons name="external-link" size={20} color={colors.primary} />
          </Link>
          <TextInput
            mode="outlined"
            label="GitHub API Key"
            value={githubKey}
            onChangeText={setGithubKey}
            secureTextEntry={githubSecure}
            style={{
              marginTop: 8,
              marginBottom: 16,
            }}
            right={
              <TextInput.Icon
                icon={githubSecure ? "eye" : "eye-off"}
                onPress={() => setGithubSecure(!githubSecure)}
              />
            }
          />
          <Button
            mode="contained"
            disabled={isPending || githubKey?.trim()=== ""}
            onPress={handleSaveGithub}
            style={{
              marginVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            icon="content-save">
            {isPending ? "Saving..." : "Save GitHub API Key"}
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
});
