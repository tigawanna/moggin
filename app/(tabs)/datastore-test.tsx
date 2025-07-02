import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { DataStore } from "../../modules/expo-glance-widget";

export default function DataStoreTestScreen() {
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(0);
  const [wakatimeHours, setWakatimeHours] = useState("--:--");
  const [status, setStatus] = useState("Ready");
  const [widgetClassName, setWidgetClassName] = useState("com.anonymous.moggin.BidiiHoursWidget");

  useEffect(() => {
    DataStore.getAll().then((data) => {
        console.log("DataStore initial data:", data);
    });
  }, []);

  const updateWidget = async () => {
    try {
      setStatus("Updating...");

      // Update widget data using DataStore
      await DataStore.set("widget_title", title || "Test Widget");
      await DataStore.set("widget_count", count.toString());
      await DataStore.set("wakatime_hours", wakatimeHours);
      await DataStore.set("last_update", new Date().toISOString());

      // Complex data example
      await DataStore.set(
        "widget_config",
        JSON.stringify({
          theme: "dark",
          showIcon: true,
          refreshInterval: 300000, // 5 minutes
        })
      );

      setStatus("Widget data updated with DataStore!");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const generateRandomHours = () => {
    const hours = Math.floor(Math.random() * 12);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const testDataStore = async () => {
    try {
      setStatus("Testing DataStore...");

      // Test basic operations
      await DataStore.set("test_string", "Hello DataStore!");
      await DataStore.set("test_number", 42);
      await DataStore.set("test_boolean", true);

      const stringValue = await DataStore.get("test_string");
      const numberValue = await DataStore.get("test_number");
      const booleanValue = await DataStore.get("test_boolean");

      setStatus(`DataStore test complete:
String: ${stringValue}
Number: ${numberValue}
Boolean: ${booleanValue}`);
    } catch (error) {
      setStatus(`DataStore test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Update DataStore and trigger widget update in one call
  const updateWidgetDirect = async () => {
    try {
      setStatus("Updating widget directly...");
      
      // This will update DataStore AND trigger widget update
      await DataStore.setAndUpdateWidgets(
        "widget_title", 
        title || "Direct Update", 
        widgetClassName
      );
      
      await DataStore.setAndUpdateWidgets(
        "widget_count", 
        count, 
        widgetClassName
      );
      
      await DataStore.setAndUpdateWidgets(
        "wakatime_hours", 
        wakatimeHours, 
        widgetClassName
      );
      
      // Update timestamp
      await DataStore.set("last_update", new Date().toISOString());
      
      setStatus(`Widget updated directly using class:\n${widgetClassName}`);
    } catch (error) {
      setStatus(`Direct update error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DataStore Widget Control</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Widget Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter widget title"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Count: {count}</Text>
        <View style={styles.buttonRow}>
          <Button title="+" onPress={() => setCount(count + 1)} />
          <Button title="-" onPress={() => setCount(Math.max(0, count - 1))} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Wakatime Hours: {wakatimeHours}</Text>
        <Button title="Generate Random" onPress={() => setWakatimeHours(generateRandomHours())} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Widget Class Name:</Text>
        <TextInput
          style={styles.input}
          value={widgetClassName}
          onChangeText={setWidgetClassName}
          placeholder="com.example.MyWidget"
        />
        <Text style={styles.hint}>
          Enter the full package + class name of your widget
        </Text>
      </View>

      <View style={styles.section}>
        <Button title="Update DataStore Only" onPress={updateWidget} />
      </View>

      <View style={styles.section}>
        <Button 
          title="Update DataStore & Refresh Widget" 
          onPress={updateWidgetDirect}
          color="#4CAF50"
        />
        <Text style={styles.hint}>
          This updates DataStore AND triggers widget update via GlanceAppWidget.update()
        </Text>
      </View>

      <View style={styles.section}>
        <Button title="Test DataStore" onPress={testDataStore} />
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  statusSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
});
