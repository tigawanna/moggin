import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

export function App() {
    const ctx = require.context("./app"); //Path with src folder
    return <ExpoRoot context={ctx} />;
  }
