import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
import { LeaderboardHeader } from './LeaderboardHeader';

interface LeaderboardEntryprops {
    entry: LeaderboardEntry;
    index: number;
    currentUser?: CurrentUserData;
    getRankIcon: (rank: number) => string;
    getRankColor: (rank: number, primaryColor: string) => string;
}

export function LeaderBoradList({}: LeaderboardEntryprops) {
      const renderHeader = useCallback(() => (
        <LeaderboardHeader
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          currentUser={currentUserData?.data}
        />
      ), [selectedPeriod, selectedCountry, currentUserData?.data]);
return (
<Surface style={{ ...styles.container }}>
    <FlatList
      style={styles.container}
      data={leaderboardData?.data}
      renderItem={renderLeaderboardItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.flatListContent}
      showsVerticalScrollIndicator={false}
    />
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
