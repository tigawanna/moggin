import { WakatimeWeeklyStats } from "@/lib/api/wakatime/use-wakatime-durations";
import { useFont } from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CartesianChart, Line } from "victory-native";

interface WakatimeWeeklyChartProps {
  wakatimeData: WakatimeWeeklyStats[];
}

export function WakatimeWeeklyChart({ wakatimeData }: WakatimeWeeklyChartProps) {
  const { colors } = useTheme();
  // You can replace this with your own font file if you have one
  // For now, we'll use a default font size
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

  // Transform the data for Victory charts
  const chartData =
    wakatimeData?.map((item, index) => {
      // Parse hours from "4h 25m" format
      const timeMatch = item?.todayHours?.match(/(\d+)h\s*(\d+)m/);
      const hours = timeMatch ? parseInt(timeMatch[1]) : 0;
      const minutes = timeMatch ? parseInt(timeMatch[2]) : 0;
      const totalHours = hours + minutes / 60;

      // Get day abbreviation from date
      const date = new Date(item?.date ?? new Date());
      const dayAbbr = date.toLocaleDateString("en-US", { weekday: "short" });

      return {
        day: dayAbbr,
        hours: totalHours,
        date: item?.date,
        project: item?.currentProject,
      };
    }) || [];

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 16,
        }}>
        <Text variant="titleMedium" style={styles.chartTitle}>
          Last 5 Days Activity
        </Text>
        <Text variant="bodySmall" style={styles.chartSubtitle}>
          Coding hours per day
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <CartesianChart
          data={chartData}
          xKey="day"
          yKeys={["hours"]}
          domainPadding={{ left: 50, right: 50, top: 30, bottom: 30 }}
          axisOptions={{
            font,
            labelColor: colors.onSurface,
            lineColor: colors.inversePrimary,
            tickCount: { x: 5, y: 5 },
            labelOffset: { x: 5, y: 5 },
            formatYLabel: (value) => `${value.toFixed(1)}h`,
            formatXLabel: (value) => value,
          }}>
          {({ points }) => (
            <Line
              points={points.hours}
              color={colors.primary}
              strokeWidth={3}
              curveType="natural"
              animate={{ type: "timing", duration: 300 }}
            />
          )}
        </CartesianChart>
      </View>

      <View style={styles.summaryContainer}>
        <Text variant="bodyLarge" style={styles.summaryText}>
          Total: {chartData.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}h this week
        </Text>
        <Text variant="bodySmall" style={styles.summarySubtext}>
          Average:{" "}
          {(chartData.reduce((sum, item) => sum + item.hours, 0) / chartData.length).toFixed(1)}h
          per day
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,

  },

  chartTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  chartSubtitle: {
    opacity: 0.7,
    fontSize: 12,
  },
  chartContainer: {
    height: 300,
    marginBottom: 16
  },
  summaryContainer: {
    // alignItems: "center",
    paddingTop: 8,
  },
  summaryText: {
    fontWeight: "500",
    marginBottom: 4,
  },
  summarySubtext: {
    opacity: 0.7,
    fontSize: 12,
  },
});
