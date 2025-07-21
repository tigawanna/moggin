import { useSnackbar } from "@/components/shared/snackbar/store";
import { checkIfTokenIsValid } from "@/lib/api/wakatime/wakatime-sdk";

import { useApiKeysStore } from "@/stores/app-settings-store";
import { EvilIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}>
        <View>
          {wakatimeApiKey && (
            <Chip 
              icon="check-circle" 
              style={styles.statusChip}
              textStyle={styles.statusChipText}>
              API Key Connected
            </Chip>
          )}
          
          <Link
            target="_blank"
            href={"https://wakatime.com/settings/api-key"}
            style={styles.linkContainer}>
            <Text variant="bodySmall" style={styles.linkText}>
              📋 Get your API key from WakaTime Settings
            </Text>
            <EvilIcons name="external-link" size={18} color={colors.primary} />
          </Link>
          
          <TextInput
            mode="outlined"
            label="WakaTime API Key"
            placeholder="waka_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={wakatimeKey}
            onChangeText={setWakatimeKey}
            secureTextEntry={wakatimeSecure}
            style={styles.textInput}
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
            style={styles.saveButton}
            icon="content-save">
            {isPending ? "Validating..." : "Save & Validate Key"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusChipText: {
    fontSize: 12,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  linkText: {
    opacity: 0.8,
    textDecorationLine: "underline",
  },
  textInput: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
