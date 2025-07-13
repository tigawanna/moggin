import { TestAllBackgroundTasks } from '@/lib/expo-background/TestAllBackgroundTasks';
import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export default function  test(){
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>test</Text>
    <TestAllBackgroundTasks/>
</Surface>
);
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
  gap: 16,
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
