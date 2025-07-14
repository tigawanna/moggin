import { useApiKeysStore } from '@/stores/app-settings-store';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { KeysIcon } from '../svg/Keys';
 
export function UnAuthorizedScreen(){
  const { colors } = useTheme();
  const { setWakatimeApiKey } = useApiKeysStore();
  const shakeValue = useSharedValue(0);
  const fadeValue = useSharedValue(0.8);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    // Subtle shake animation for the icon
    shakeValue.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 100 }),
        withTiming(2, { duration: 100 }),
        withTiming(-2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );

    // Fade animation for text
    fadeValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.8, { duration: 2000 })
      ),
      -1,
      false
    );

    // Scale animation for icon
    scaleValue.value = withRepeat(
      withSequence(
        withSpring(1.05, { damping: 8 }),
        withSpring(1, { damping: 8 })
      ),
      -1,
      false
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeValue.value },
      { scale: scaleValue.value }
    ],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const handleDeleteKey = () => {
    setWakatimeApiKey(null);
    router.push('/api-keys');
  };

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <KeysIcon height={120} />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text 
            variant='headlineSmall' 
            style={[styles.title, { color: colors.error }]}
          >
            🔒 Access Denied
          </Text>
          
          <Animated.View style={animatedTextStyle}>
            <Text 
              variant='bodyLarge' 
              style={[styles.message, { color: colors.onSurfaceVariant }]}
            >
              Your WakaTime API key is invalid or has expired. 
            </Text>
          </Animated.View>
          
          <Text 
            variant='bodyMedium' 
            style={[styles.hint, { color: colors.outline }]}
          >
            Please delete the current key and add a new one to continue.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <Button 
            mode="contained" 
            onPress={handleDeleteKey}
            style={[styles.button, { backgroundColor: colors.error }]}
            labelStyle={{ color: colors.onError }}
            icon="key-remove"
          >
            Delete Key & Add New
          </Button>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 32,
    padding: 16,
  },
  textContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  hint: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    elevation: 4,
  },
});
