import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol, MaterialIcon } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        //  headerShown: false, // Hide headers for all tab screens
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 0,
          // backgroundColor: colors.surface,
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            backgroundColor: colors.surface,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
