import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SharedPreferences } from '@/modules/expo-glance-widget';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function SharedPreferencesDemo() {
  const [storedValue, setStoredValue] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('test_key');
  const [inputValue, setInputValue] = useState<string>('Hello Widget!');
  const [allPrefs, setAllPrefs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await loadStoredValue();
      await loadAllPrefs();
    };
    loadInitialData();
  }, [inputKey]);

  const loadStoredValue = async () => {
    try {
      const value = await SharedPreferences.get(inputKey);
      setStoredValue(value?.toString() || 'Not found');
    } catch (error) {
      console.error('Error getting shared preference:', error);
      Alert.alert('Error', 'Failed to get stored value');
    }
  };

  const loadAllPrefs = async () => {
    try {
      const prefs = await SharedPreferences.getAll();
      setAllPrefs(prefs);
    } catch (error) {
      console.error('Error getting all preferences:', error);
    }
  };

  const handleSetValue = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }

    setLoading(true);
    try {
      await SharedPreferences.set(inputKey, inputValue);
      
      // Also set some demo data for the widget
      await SharedPreferences.set('last_update_time', new Date().toLocaleTimeString());
      await SharedPreferences.set('total_hours_today', Math.random() * 8);
      await SharedPreferences.set('wakatime_hours', `${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`);
      
      Alert.alert('Success', 'Value stored successfully');
      await loadStoredValue();
      await loadAllPrefs();
    } catch (error) {
      console.error('Error setting shared preference:', error);
      Alert.alert('Error', 'Failed to store value');
    } finally {
      setLoading(false);
    }
  };

  const handleGetValue = async () => {
    await loadStoredValue();
  };

  const handleRemoveValue = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }

    setLoading(true);
    try {
      await SharedPreferences.remove(inputKey);
      Alert.alert('Success', 'Value removed successfully');
      await loadStoredValue();
      await loadAllPrefs();
    } catch (error) {
      console.error('Error removing shared preference:', error);
      Alert.alert('Error', 'Failed to remove value');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to clear all shared preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await SharedPreferences.clear();
              Alert.alert('Success', 'All preferences cleared');
              await loadStoredValue();
              await loadAllPrefs();
            } catch (error) {
              console.error('Error clearing preferences:', error);
              Alert.alert('Error', 'Failed to clear preferences');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="title">SharedPreferences Demo</ThemedText>
        <ThemedText>
          Test the shared preferences functionality that can be accessed from both JavaScript and Android widgets.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Set/Get Value</ThemedText>
        
        <View style={styles.inputContainer}>
          <ThemedText>Key:</ThemedText>
          <TextInput
            style={styles.input}
            value={inputKey}
            onChangeText={setInputKey}
            placeholder="Enter key"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText>Value:</ThemedText>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter value"
          />
        </View>

        <View style={styles.buttonRow}>
          <Button 
            title="Set Value" 
            onPress={handleSetValue} 
            disabled={loading}
          />
          <Button 
            title="Get Value" 
            onPress={handleGetValue} 
            disabled={loading}
          />
          <Button 
            title="Remove" 
            onPress={handleRemoveValue} 
            disabled={loading}
            color="#ff6b6b"
          />
        </View>

        <ThemedView style={styles.resultContainer}>
          <ThemedText type="defaultSemiBold">Stored Value:</ThemedText>
          <ThemedText>{storedValue}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Widget Demo Data</ThemedText>
        <ThemedText>
          Press &quot;Set Value&quot; to automatically update widget demo data including last_update_time, total_hours_today, and wakatime_hours.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">All Stored Preferences</ThemedText>
        <Button 
          title="Clear All" 
          onPress={handleClearAll} 
          disabled={loading}
          color="#ff6b6b"
        />
        
        <ThemedView style={styles.prefsContainer}>
          {Object.keys(allPrefs).length === 0 ? (
            <ThemedText>No preferences stored</ThemedText>
          ) : (
            Object.entries(allPrefs).map(([key, value]) => (
              <ThemedView key={key} style={styles.prefItem}>
                <ThemedText type="defaultSemiBold">{key}:</ThemedText>
                <ThemedText>{String(value)}</ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  resultContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginTop: 12,
  },
  prefsContainer: {
    marginTop: 12,
  },
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
