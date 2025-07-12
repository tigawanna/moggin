import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Chill } from '../svg/Chill';

export function TooManyRequestsScreen() {
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge" style={{ textAlign: 'center' }}>
        Too Many Requests  let's take a breath
      </Text>
      <Chill />
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
  },
});
