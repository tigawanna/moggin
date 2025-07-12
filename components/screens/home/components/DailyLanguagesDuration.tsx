import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
//  TODO : maybe add this and 2 other and nest them in a tab view https://www.reactnativepapertabs.com/
export function DailyLanguagesDuration(){
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>DailyLanguagesDuration</Text>
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
