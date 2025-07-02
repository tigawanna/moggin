import { DataStore } from 'expo-glance-widget';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WidgetControlScreenDataStore() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);
  const [wakatimeHours, setWakatimeHours] = useState('--:--');

  const updateWidget = async () => {
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
        <Button title="Update Widget" onPress={updateWidget} />
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
    gap: 10,
    marginTop: 8,
  },
});
