
import { Overview } from "@/components/screens/home/Overview";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

export default function HomeScreen() {
  return (
    <Surface style={styles.container}>
      <Overview />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  header: {
    alignItems: "center",
    marginVertical: 24,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    marginTop: 4,
  },
  divider: {
    marginVertical: 24,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  button: {
    width: "80%",
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
});
