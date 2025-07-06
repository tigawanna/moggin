import { getWakatimeWidgetKey } from "@/lib/datastore/store";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";

export function WakatimeWidgetKey() {
  const { data } = useQuery({
    queryKey: ["wakatime-widget-key"],
    queryFn: getWakatimeWidgetKey,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">wakatimeWidgetKey</Text>
      <Text variant="bodyLarge">{data ?? "No key found"}</Text>
      <Text variant="bodyMedium">This is the key used to fetch Wakatime data</Text>
      <Text variant="bodySmall">You can change it in the settings</Text>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
