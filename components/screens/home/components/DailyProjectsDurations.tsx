import { UserDailyDurationsData } from "@/lib/api/wakatime/types/current-user-types";
import { formatWakatimeDuration, formatWakatimeMsToHumanReadable } from "@/utils/date";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Switch, Text } from "react-native-paper";

interface DailyProjectsDurationsProps {
  grouped?: boolean;
  projects: UserDailyDurationsData[];
}

export function DailyProjectsDurations({ grouped, projects }: DailyProjectsDurationsProps) {
  const renderProjectItem = (item: UserDailyDurationsData, index: number) => (
    <Card key={`${item.project}-${index}`} style={styles.projectCard} elevation={2}>
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text variant="bodyMedium" style={{ marginRight: 8 }}>
            {grouped ? "Grouped" : "Ungrouped"}
          </Text>
          <Switch
            value={grouped}
            onValueChange={() => {
              router.setParams({ grouped: grouped ? "false" : "true" });
            }}
          />
        </View>
      </View>

      <View style={styles.projectsList}>
        {projects.map((item, index) => renderProjectItem(item, index))}
      </View>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    marginBottom: 50,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  projectsList: {
    gap: 8,
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
