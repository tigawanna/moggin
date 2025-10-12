import { generateLastFiveDates } from "@/utils/date";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons,} from "react-native-paper";

interface WakatimeDayPickerProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function WakatimeDayPicker({ selectedDate, setSelectedDate }: WakatimeDayPickerProps) {
  // const { selectedDate, setSelectedDate } = useCurrentWakatimeDate();


  const generateDateOptions = useCallback(() => generateLastFiveDates(4), []); // Empty dependency array since this only depends on current date
  
  const dateOptions = useMemo(() => generateDateOptions(), [generateDateOptions]);
//   console.log("Date Options:", dateOptions);
  return (
    <SegmentedButtons
      value={selectedDate}
      onValueChange={(date)=>{
        setSelectedDate(date);
              router.setParams({ grouped:"true" });
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
