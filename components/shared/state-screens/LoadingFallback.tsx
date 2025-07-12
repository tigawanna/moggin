import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { AppLogo } from "../svg/AppLogo";
import { LoadingIndicatorDots } from "./LoadingIndicatorDots";

export function LoadingFallback() {
  return (
    <Surface style={{ ...styles.container }}>
      <AppLogo />
      <LoadingIndicatorDots />
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
    gap: 16,
  },
});
