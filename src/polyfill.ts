// import { getRandomValues } from 'expo-crypto'
import "react-native-random-uuid";


globalThis.performance.mark = globalThis?.performance.mark ?? (() => {});
globalThis.performance.measure = globalThis?.performance.measure ?? (() => {});


// Fix for TanStack DB / Zod instanceof checks on web
if (typeof window !== "undefined") {
  // Ensure constructor functions have proper name properties for Zod instanceof checks
  const constructors: any[] = [Date, Array, Object, Function, RegExp, URL];

  if (typeof File !== "undefined") {
    constructors.push(File);
  }

  constructors.forEach((constructor) => {
    if (!constructor.name) {
      Object.defineProperty(constructor, "name", {
        value: constructor.toString().match(/function\s*([^(]*)/)?.[1] || "Constructor",
        configurable: true,
      });
    }
  });
}
