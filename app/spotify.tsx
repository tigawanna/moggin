
import { SpotifyScreen } from '@/components/screens/spotify/SpotifyScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function Spotify() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Spotify Details',
        headerBackTitle: 'Home'
      }} />
      <SpotifyScreen />
    </>
  );
}
