import { PaperProvider } from "react-native-paper";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useThemeSetup } from "@/hooks/useThemeSetup";

export function AboveContextThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, paperTheme } = useThemeSetup();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeProvider>
  );
}
