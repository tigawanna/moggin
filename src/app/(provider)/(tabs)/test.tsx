import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function Test() {
  const screenHeight = Dimensions.get("window").height;
  const boxHeight = useSharedValue(0);
  const boxWidth = useSharedValue(100);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    boxHeight.value = withTiming(screenHeight / 2, {
      duration: 700,
    });
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    boxHeight.value = withTiming(0, {
      duration: 700,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: boxWidth.value,
      height: boxHeight.value,
      backgroundColor: "red",
    };
  });

  return (
    <Surface style={styles.container}>
      <Text variant="titleLarge">test</Text>
      <Animated.View style={animatedStyle}></Animated.View>

      <Button
        mode="contained"
        onPress={startAnimation}
        style={styles.button}
        disabled={isAnimating}>
        Start Animation
      </Button>

      <Button mode="outlined" onPress={resetAnimation} style={styles.button}>
        Reset
      </Button>
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
    gap: 10,
  },
  button: {
    marginTop: 10,
    width: 200,
  },
});
