import { useApiKeysStore } from '@/stores/use-app-settings';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { KeysIcon } from '../svg/Keys';
 
export function UnAuthorizedScreen(){
  const {setWakatimeApiKey } = useApiKeysStore();

  const handleDeleteKey = () => {
    setWakatimeApiKey(null);
    router.push('/api-keys');
  };

  return (
    <Surface style={{ ...styles.container }}>
      <Text variant='headlineLarge' style={styles.title}>
        Invalid API Key
      </Text>
      <KeysIcon height={140}/>
      <Text variant='bodyLarge' style={styles.message}>
        Your WakaTime API key is invalid or has expired. Please delete the current key and add a new one.
      </Text>
      <Button 
        mode="contained" 
        onPress={handleDeleteKey}
        style={styles.button}
      >
        Delete Key & Add New
      </Button>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 8,
  },
})
