import { useCurrentWakatimeDate } from "@/hooks/use-current-date";
import { generateLastFiveDates } from "@/utils/date";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons, Surface, Text } from "react-native-paper";

export function WakatimeDayPicker() {
  const { selectedDate, setSelectedDate } = useCurrentWakatimeDate();


  const generateDateOptions = useCallback(() => generateLastFiveDates(4), []); // Empty dependency array since this only depends on current date
  
  const dateOptions = useMemo(() => generateDateOptions(), [generateDateOptions]);
//   console.log("Date Options:", dateOptions);
  return (
    <SegmentedButtons
      value={selectedDate}
      onValueChange={(date)=>{
        setSelectedDate(date);
        }}
      buttons={dateOptions}
      style={styles.segmentedButtons}
    />
  );
}
const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  segmentedButtons: {
    width: "100%",
  },
});
