import { UserDailyDurationsData } from "@/data-access-layer/wakatime/types/current-user-types";
import { formatWakatimeDuration, formatWakatimeMsToHumanReadable } from "@/utils/date";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Switch, Text } from "react-native-paper";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

interface DailyProjectsDurationsProps {
  grouped?: boolean;
  projects: UserDailyDurationsData[];
  handleToggleGrouped?: () => void;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

export function DailyProjectsDurations({
  grouped,
  projects,
  handleToggleGrouped,
}: DailyProjectsDurationsProps) {
  const renderProjectItem = (item: UserDailyDurationsData, index: number) => (
    <AnimatedCard
      key={`${item.project}-${index}`}
      style={styles.projectCard}
      elevation={2}
      entering={FadeIn.delay(index * 100).duration(500)}
      exiting={FadeOut.duration(500)}
      layout={Layout.springify()}>
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
    </AnimatedCard>
  );

  return (
    <AnimatedSurface style={styles.container} entering={FadeIn.duration(600)}>
      <Animated.View
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        entering={FadeIn.delay(100).duration(500)}>
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
              handleToggleGrouped?.();
            }}
          />
        </View>
      </Animated.View>

      <Animated.View style={styles.projectsList} layout={Layout.springify()}>
        {projects.map((item, index) => renderProjectItem(item, index))}
      </Animated.View>
    </AnimatedSurface>
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
