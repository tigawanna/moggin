import { RefreshControlType } from "@/hooks/use-refresh";
import { UserDailyDurationsData } from "@/lib/api/wakatime/types/current-user-types";
import { formatWakatimeDuration, formatWakatimeMsToHumanReadable } from "@/utils/date";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Surface, Switch, Text } from "react-native-paper";

interface DailyProjectsProps {
  grouped?:boolean;
  projects: UserDailyDurationsData[];
  RefreshControl?: RefreshControlType;
}

export function DailyProjects({ grouped,projects, RefreshControl }: DailyProjectsProps) {

  // const { grouped } = useLocalSearchParams<{ grouped: "true" | "false" }>();
  const renderProjectItem = ({ item }: { item: UserDailyDurationsData }) => (
    <Card style={styles.projectCard} elevation={2}>
      <Card.Title title={item.project} />
      <Card.Content style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text variant="bodyMedium" style={styles.duration}>
          {formatWakatimeDuration(item.duration)}
        </Text>
        <Text variant="bodyMedium" style={styles.duration}>
          {formatWakatimeMsToHumanReadable(item.time)}
        </Text>
        {item.color && <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />}
      </Card.Content>
    </Card>
  );

  return (
    <Surface style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text variant="titleLarge" style={styles.title}>
          Projects
        </Text>
        <Switch
          value={grouped}
          onValueChange={() => {
            router.setParams({ grouped: grouped ? "false" : "true" });
          }}
        />
      </View>

      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item, index) => `${item.project}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={RefreshControl}
      />
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  projectCard: {
    marginBottom: 8,
  },
  projectName: {
    fontWeight: "bold",
  },
  duration: {
    marginTop: 4,
    opacity: 0.7,
  },
  colorIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
