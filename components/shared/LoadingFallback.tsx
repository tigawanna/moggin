import { StyleSheet } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { useThemeStore } from "@/stores/use-app-settings";
export function LoadingFallback() {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  // const blurhashHeight = 100;
  // const blurhashWidth = 100;
  const {colors} = useTheme();
  const {isDarkMode} =useThemeStore();
  const splashScreenImage = isDarkMode
    ? require("@/assets/icons/splash-icon-dark.png")
    : require("@/assets/icons/splash-icon-light.png");
  return (
    <Surface style={{ ...styles.container }}>
      <Image
        source={splashScreenImage}
        style={{
          width: "auto",
          height: 400,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        // placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
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
