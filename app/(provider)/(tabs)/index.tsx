import { HomeScreenComponent } from "@/components/screens/home/HomeScreenComponent";
import { StyleSheet } from "react-native";
import { Surface,Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={[styles.container, { paddingTop: top + 10 }]}>
      <Text variant="headlineLarge" style={{ marginBottom: 6 }}>Moggin</Text>
      <HomeScreenComponent />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 20,
  }
});
