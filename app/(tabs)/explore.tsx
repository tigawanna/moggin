import ExpoGlance from "@/modules/expo-glance-widget";
import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 20 }}>
      <Text style={{ color: "#fff" }}>Widget updates here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
