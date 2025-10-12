import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export default function Test(){
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>test</Text>
</Surface>
);
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
