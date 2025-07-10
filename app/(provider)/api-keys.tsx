import { ApiKeysSeettings } from "@/components/screens/settings/ApiKeysSeettings";
import { Stack } from "expo-router";
import React from "react";
import { Surface, useTheme } from "react-native-paper";



export default function ApiKeysScreen() {
  const theme = useTheme();
  return (
    <Surface style={{ flex: 1, padding: 4 }}>
      <Stack.Screen
        options={{
          title: "API Keys",
          headerBackTitle: "Settings",
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      />
      <ApiKeysSeettings />
    </Surface>
  );
}
