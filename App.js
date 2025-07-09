// during CI builds this doesn't get auto generated properly
// so we need to manually import the ExpoRoot component from expo-router 
import { ExpoRoot } from "expo-router";

export function App() {
    const ctx = require.context("./app"); //Path with src folder
    return <ExpoRoot context={ctx} />;
  }
