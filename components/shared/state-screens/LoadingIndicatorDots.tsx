import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface LoadingIndicatorDotsProps {
  size?: number;
  dotCount?: number;
}

export function LoadingIndicatorDots({ 
  size = 8, 
  dotCount = 3 
}: LoadingIndicatorDotsProps) {
  const animatedValues = Array.from({ length: dotCount }, () => useSharedValue(0));

  useEffect(() => {
    animatedValues.forEach((animatedValue, index) => {
      animatedValue.value = withDelay(
        index * 200,
        withRepeat(
          withTiming(1, { duration: 600 }),
          -1,
          true
        )
      );
    });
  }, []);

  const createAnimatedStyle = (animatedValue: Animated.SharedValue<number>) => {
    return useAnimatedStyle(() => {
      const scale = interpolate(animatedValue.value, [0, 1], [0.5, 1.2]);
      const opacity = interpolate(animatedValue.value, [0, 1], [0.3, 1]);
      
      return {
        transform: [{ scale }],
        opacity,
      };
    });
  };
 const { colors } = useTheme();
  return (
      <View style={styles.dotsContainer}>
        {animatedValues.map((animatedValue, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.primary,
              },
              createAnimatedStyle(animatedValue),
            ]}
          />
        ))}
      </View>
  );
}
const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 4,
  },
})
