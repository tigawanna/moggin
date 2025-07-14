import { useSnackbar } from "@/components/shared/snackbar/store";
import { checkIfTokenIsValid } from "@/lib/api/wakatime/wakatime-sdk";

import { useApiKeysStore } from "@/stores/app-settings-store";
import { EvilIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Surface, Text, TextInput, useTheme } from "react-native-paper";

export function WakatimeApiKey() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const { wakatimeApiKey, setWakatimeApiKey } = useApiKeysStore();
  const [wakatimeKey, setWakatimeKey] = useState(wakatimeApiKey || "");
  const [wakatimeSecure, setWakatimeSecure] = useState(true);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      // Your mutation logic here
      return checkIfTokenIsValid({
        token,
      });
    },

    onSuccess: (data, { token }) => {
      setWakatimeApiKey(token);
      if(!data.isValid){
        showSnackbar(data?.error??"Something went wrong", {
          onDismiss: () => {
            console.log("Snackbar dismissed");
          },
        });
        return;
      }
      showSnackbar("Wakatime API key saved successfully!", {
        duration: 3000,
        action: {
          label: "Go Home",
          onPress: () => {
            router.push("/");
          },
        },
        onDismiss: () => {
          // Auto redirect to home after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 500);
        },
      });
    },
    onError(error, variables, context) {
      console.log("Error saving Wakatime API key:", error);
      showSnackbar("Error saving Wakatime API key", {
        duration: 5000, // 5 seconds
        action: {
          label: "Retry",
          onPress: () => {
            // Logic to retry
            mutate({ token: variables.token });
          },
        },
        onDismiss: () => {
          console.log("Snackbar dismissed");
        },
      });
    },
  });

  const handleSaveWakatime = () => {
    mutate({ token: wakatimeKey.trim() });
  };

  return (
    <Surface style={{ ...styles.container }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}>
        <View style={{ marginBottom: 24 }}>
          <Text
            variant="titleMedium"
            style={{
              fontWeight: "bold",
            }}>
            Wakatime
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
            Used to track your coding activity and statistics
          </Text>
          <Link
            target="_blank"
            href={"https://wakatime.com/settings/api-key"}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 8,
              paddingVertical: 8,
              textDecorationLine: "underline",
              textDecorationColor: colors.inversePrimary,
            }}>
            <Text variant="bodySmall">• Wakatime: Go to Settings → API Key</Text>
            <EvilIcons name="external-link" size={20} color={colors.primary} />
          </Link>
          <TextInput
            mode="outlined"
            label="Wakatime API Key"
            value={wakatimeKey}
            onChangeText={setWakatimeKey}
            secureTextEntry={wakatimeSecure}
            style={{
              marginTop: 8,
              marginBottom: 16,
            }}
            right={
              <TextInput.Icon
                icon={wakatimeSecure ? "eye" : "eye-off"}
                onPress={() => setWakatimeSecure(!wakatimeSecure)}
              />
            }
          />
          <Button
            mode="contained"
            onPress={handleSaveWakatime}
            disabled={isPending || wakatimeKey?.trim() === ""}
            style={{
              marginVertical: 8,
            }}
            icon="content-save">
            {isPending ? "Saving..." : "Save Wakatime API Key"}
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
