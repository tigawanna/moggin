import ExpoGlanceWidgetModule from 'expo-glance-widget';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

/**
 * Example React Native component that demonstrates how to update widget data
 * using the DataStore interface
 */

export default function WidgetControlScreen() {
  const [userName, setUserName] = useState('');
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState('offline');
  const [currentValues, setCurrentValues] = useState<Record<string, string>>({});

  // Load current values from DataStore on component mount
  useEffect(() => {
    loadCurrentValues();
  }, []);

  const loadCurrentValues = async () => {
    try {
      const values = await ExpoGlanceWidgetModule.getAllDatastoreValues();
      setCurrentValues(values);
      
      // Update local state with current values
      if (values.user_name) setUserName(values.user_name);
      if (values.counter) setCounter(parseInt(values.counter) || 0);
      if (values.status) setStatus(values.status);
    } catch (error) {
      console.error('Failed to load current values:', error);
    }
  };

  const updateUserName = async () => {
    try {
      await ExpoGlanceWidgetModule.updateDatastoreValue('user_name', userName);
      await ExpoGlanceWidgetModule.updateDatastoreValue('last_update', new Date().toISOString());
      Alert.alert('Success', 'User name updated in widget!');
      loadCurrentValues();
    } catch (error) {
      console.error('Failed to update user name:', error);
      Alert.alert('Error', 'Failed to update user name');
    }
  };

  const incrementCounter = async () => {
    try {
      const newCounter = counter + 1;
      await ExpoGlanceWidgetModule.updateDatastoreValue('counter', newCounter.toString());
      await ExpoGlanceWidgetModule.updateDatastoreValue('last_update', new Date().toISOString());
      setCounter(newCounter);
      Alert.alert('Success', 'Counter incremented!');
      loadCurrentValues();
    } catch (error) {
      console.error('Failed to increment counter:', error);
      Alert.alert('Error', 'Failed to increment counter');
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = status === 'online' ? 'offline' : 'online';
      await ExpoGlanceWidgetModule.updateDatastoreValue('status', newStatus);
      await ExpoGlanceWidgetModule.updateDatastoreValue('last_update', new Date().toISOString());
      setStatus(newStatus);
      Alert.alert('Success', `Status changed to ${newStatus}!`);
      loadCurrentValues();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      Alert.alert('Error', 'Failed to toggle status');
    }
  };

  const clearAllData = async () => {
    try {
      const keys = await ExpoGlanceWidgetModule.getAllDatastoreKeys();
      for (const key of keys) {
        await ExpoGlanceWidgetModule.deleteDatastoreValue(key);
      }
      Alert.alert('Success', 'All widget data cleared!');
      loadCurrentValues();
    } catch (error) {
      console.error('Failed to clear data:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Widget Control Panel</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Name</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter user name"
        />
        <Button title="Update User Name" onPress={updateUserName} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Counter: {counter}</Text>
        <Button title="Increment Counter" onPress={incrementCounter} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status: {status}</Text>
        <Button title="Toggle Status" onPress={toggleStatus} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Widget Data</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(currentValues, null, 2)}
        </Text>
        <Button title="Refresh Data" onPress={loadCurrentValues} />
      </View>

      <View style={styles.section}>
        <Button title="Clear All Data" onPress={clearAllData} color="#ff4444" />
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
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});
