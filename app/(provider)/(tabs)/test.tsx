import { NoDataScreen } from '@/components/shared/state-screens/NoDataScreen';
import { TooManyRequestsScreen } from '@/components/shared/state-screens/TooManyRequestsScreen';
import { UnAuthorizedScreen } from '@/components/shared/state-screens/UnAuthorizedScreen';
import { ScrollView, StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';

export default function test(){
return (
<ScrollView style={{ ...styles.container }}>
    <Text variant='titleLarge'>test</Text>
    <NoDataScreen/>
    <TooManyRequestsScreen/>
    <UnAuthorizedScreen/>
</ScrollView>
);
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
//   justifyContent: 'center',
//   alignItems: 'center',
}
})
