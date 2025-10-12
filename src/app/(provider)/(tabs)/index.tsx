import { HomeScreenComponent } from "@/components/screens/home/HomeScreenComponent";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";


export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <HomeScreenComponent />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
  }
});
