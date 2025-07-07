import { getAllDatastoreData } from '@/lib/datastore/store';
import { useQuery } from '@tanstack/react-query';
import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function TestDatastore(){
    const { data, error, isPending } = useQuery({
        queryKey: ['all-datastore-keys'],
        queryFn: async () => {
            // Replace with actual datastore logic
            return getAllDatastoreData();
        },
        refetchOnWindowFocus: false,
    })
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>TestDatastore</Text>
    {isPending && <Text>Loading...</Text>}
    {error && <Text>Error: {error.message}</Text>}
    {data && (
        <>
            <Text>Values: {JSON.stringify(data.values)}</Text>
        </>
    )}
</Surface>
);
}
const styles = StyleSheet.create({
container:{
  padding: 16,  
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})
