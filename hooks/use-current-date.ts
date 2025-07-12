import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export function useCurrentWakatimeDate() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [selectedDate, setSelected] = useState(
    date ? new Date(date).toISOString().split("T")[0] 
    : new Date().toISOString().split("T")[0]
  );
  function setSelectedDate(newDate: string) {
    const newDateObj = new Date(newDate);
    if (!isNaN(newDateObj.getTime())) {
     const newSelectedDate = newDateObj.toISOString().split("T")[0];
      router.setParams({ date: newSelectedDate });
    } else {
      console.error("Invalid date format:", newDate);
    }
  }
  useEffect(() => {
    if (date) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        setSelected(dateObj.toISOString().split("T")[0]);
      } else {
        console.error("Invalid date format from params:", date);
      }
    }
  }, [date]);

  return {
    selectedDate,
    setSelectedDate,
  };
}
