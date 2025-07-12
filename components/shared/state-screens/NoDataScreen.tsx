import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { RestingIcon } from "../svg/Resting";

export function NoDataScreen() {
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">Nothing on my end</Text>
      <RestingIcon />
      <Text variant="titleSmall">No Data Available</Text>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    gap: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
