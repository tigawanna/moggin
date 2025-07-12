import { HapticTab } from "@/components/default/HapticTab";
import { IconSymbol, MaterialCommunityIcon, MaterialIcon } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        lazy: false,
        animation: "shift",
        //  headerShown: false, // Hide headers for all tab screens
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 0,
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
          animation: "none",
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          animation: "none",
          title: "weekly",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="auto-graph" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          animation: "none",
          title: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcon size={28} name="trophy" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          animation: "none",
          title: "Settings",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
