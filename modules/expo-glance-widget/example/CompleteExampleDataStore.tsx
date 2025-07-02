import { DataStore } from 'expo-glance-widget';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WidgetControlScreenDataStore() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);
  const [wakatimeHours, setWakatimeHours] = useState('--:--');
  const [widgetClassName, setWidgetClassName] = useState('com.example.PRWidget');
  
  // Load initial values on component mount
  useEffect(() => {
    async function loadData() {
      try {
        // Get saved data from DataStore if it exists
        const savedTitle = await DataStore.get('widget_title');
        const savedCount = await DataStore.get('widget_count');
        const savedHours = await DataStore.get('wakatime_hours');
        
        if (savedTitle) setTitle(savedTitle as string);
        if (savedCount !== null) setCount(savedCount as number);
        if (savedHours) setWakatimeHours(savedHours as string);
      } catch (error) {
        console.error('Failed to load widget data:', error);
      }
    }
    
    loadData();
  }, []);

  const updateWidget = async () => {
    try {
      // Update widget data using DataStore
      await DataStore.set('widget_title', title);
      await DataStore.set('widget_count', count);
      await DataStore.set('wakatime_hours', wakatimeHours);
      await DataStore.set('last_update', new Date().toISOString());
      
      // Complex data example
      await DataStore.set('widget_config', JSON.stringify({
        theme: 'dark',
        showIcon: true,
        refreshInterval: 300000 // 5 minutes
      }));
      
      console.log('Widget data updated with DataStore!');
    } catch (error) {
      console.error('Failed to update widget data:', error);
    }
  };
  
  // Update DataStore and automatically update the widget
  const updateWidgetWithRefresh = async () => {
    try {
      // Validate widget class name is provided
      if (!widgetClassName.trim()) {
        console.warn('Widget class name is required for direct updates');
        return;
      }

      // This will update the DataStore AND trigger a widget update
      // First, update all the individual fields with widget updates
      await DataStore.setAndUpdateWidgets(
        'widget_title', 
        title || 'Default Title',
        widgetClassName
      );
      
      await DataStore.setAndUpdateWidgets(
        'widget_count', 
        count,
        widgetClassName
      );
      
      await DataStore.setAndUpdateWidgets(
        'wakatime_hours', 
        wakatimeHours,
        widgetClassName
      );
      
      // Regular DataStore update for timestamp (no widget update needed)
      await DataStore.set('last_update', new Date().toISOString());
      
      // You could also store complex data
      await DataStore.set('widget_config', JSON.stringify({
        theme: 'dark',
        showIcon: true,
        refreshInterval: 300000
      }));
      
      console.log(`Widget data updated and widget ${widgetClassName} refresh triggered!`);
    } catch (error) {
      console.error('Failed to update widget with refresh:', error);
    }
  };

  const generateRandomHours = () => {
    const hours = Math.floor(Math.random() * 12);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const updateWakatimeHours = () => {
    const newHours = generateRandomHours();
    setWakatimeHours(newHours);
  };

  return (
    <View style={styles.container}>
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
        <Button title="Generate Random Hours" onPress={updateWakatimeHours} />
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
          Enter the fully qualified class name of your widget
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Options:</Text>
        <View style={styles.buttonRow}>
          <Button 
            title="DataStore Only" 
            onPress={updateWidget} 
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="DataStore + Widget Refresh" 
            onPress={updateWidgetWithRefresh}
            color="#4CAF50"
          />
        </View>
        <Text style={styles.hint}>
          The second button uses DataStore.setAndUpdateWidgets() to update data AND refresh the widget
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonSpacer: {
    width: 10,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});
