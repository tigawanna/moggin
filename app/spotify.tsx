
import { SpotifyScreen } from '@/components/screens/spotify/SpotifyScreen';
import { Stack } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function Spotify() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen
        options={{
          title: "Spotify Details",
          headerBackTitle: "Home",
          headerStyle: {
            backgroundColor: colors.surface,
          },
        }}
      />
      <SpotifyScreen />
    </>
  );
}
