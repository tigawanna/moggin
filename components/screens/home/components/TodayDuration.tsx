import { updateWakatimeHoursWidget } from "@/lib/datastore/wakatime-widget";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider, Surface, Text } from "react-native-paper";
interface TodayDurationProps {
  todayHours: {
    readonly date: string;
    readonly todayHours: `${number}h ${number}m`;
    readonly totalDurations: number;
    readonly currentProject: string;
  };
}

export function TodayDuration({ todayHours }: TodayDurationProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  useEffect(() => {
    // Call the update function whenever todayHours changes
    updateWakatimeHoursWidget({
      currentProject: todayHours.currentProject,
      lastSync: todayHours.date,
      totalTime: todayHours.todayHours,
    });
  }, [todayHours]);

  return (
    <Surface style={styles.container}>
      <Card style={styles.card} elevation={4}>
        <Card.Content style={styles.cardContent}>
          {/* Main duration display */}
          <View style={styles.mainDurationContainer}>
            <Text variant="displayLarge" style={styles.mainDuration}>
              {todayHours.todayHours}
            </Text>
            <Text variant="bodyLarge" style={styles.mainLabel}>
              Today's Total
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Details section */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Date
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {formatDate(todayHours.date)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Current Project
              </Text>
              <Text variant="bodyMedium" style={[styles.detailValue, styles.projectName]}>
                {todayHours.currentProject}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Total Sessions
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {todayHours.totalDurations}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
  cardContent: {
    padding: 24,
  },
  mainDurationContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  mainDuration: {
    fontWeight: "bold",
    textAlign: "center",
  },
  mainLabel: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.8,
  },
  divider: {
    marginVertical: 16,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  projectName: {
    fontWeight: "600",
  },
});
