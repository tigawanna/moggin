import WidgetUpdater from "@/modules/expo-wakatime-glance-widgets";
import { useMutation } from "@tanstack/react-query";

import { StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";

export function TestWidgetUpdate() {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await WidgetUpdater.updateWakatimeWidget({
        currentProject: "Test Project",
        lastSync: "2023-10-01T12:00:00Z",
        totalTime: "12h : 30min",
      });
    },
  });
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">TestWidgetUpdate</Text>
      <Button onPress={() => mutate()} disabled={isPending}>
        {isPending ? "Updating..." : "Update Widget"}
      </Button>
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
