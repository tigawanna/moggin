// Complete example demonstrating all features of expo-glance-widget
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';
import {
    clearSharedPreferences,
    getAllSharedPreferences,
    getSharedPreference,
    setSharedPreference
} from '../index';

interface UserProfile {
  name: string;
  level: number;
  xp: number;
  achievements: string[];
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoUpdate: boolean;
  };
}

interface WidgetStats {
  totalViews: number;
  lastUpdate: string;
  errorCount: number;
}

export default function CompleteExampleScreen() {
  // Simple state
  const [title, setTitle] = useState('My Widget');
  const [counter, setCounter] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Complex state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Demo User',
    level: 1,
    xp: 0,
    achievements: [],
    preferences: {
      theme: 'light',
      notifications: true,
      autoUpdate: false
    }
  });
  
  const [widgetStats, setWidgetStats] = useState<WidgetStats>({
    totalViews: 0,
    lastUpdate: new Date().toISOString(),
    errorCount: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load simple values
      const savedTitle = await getSharedPreference('widget_title');
      const savedCounter = await getSharedPreference('widget_counter');
      const savedEnabled = await getSharedPreference('widget_enabled');

      if (savedTitle) setTitle(savedTitle as string);
      if (savedCounter) setCounter(savedCounter as number);
      if (savedEnabled !== null) setIsEnabled(savedEnabled as boolean);

      // Load complex JSON data
      const savedProfile = await getSharedPreference('user_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile as string));
      }

      const savedStats = await getSharedPreference('widget_stats');
      if (savedStats) {
        setWidgetStats(JSON.parse(savedStats as string));
      }

      console.log('All data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load saved data');
    }
  };

  // Save simple data
  const saveBasicData = async () => {
    try {
      await setSharedPreference('widget_title', title);
      await setSharedPreference('widget_counter', counter);
      await setSharedPreference('widget_enabled', isEnabled);
      
      console.log('Basic data saved');
      Alert.alert('Success', 'Basic widget data saved!');
    } catch (error) {
      console.error('Error saving basic data:', error);
      Alert.alert('Error', 'Failed to save basic data');
    }
  };

  // Save complex JSON data
  const saveComplexData = async () => {
    try {
      await setSharedPreference('user_profile', JSON.stringify(userProfile));
      await setSharedPreference('widget_stats', JSON.stringify(widgetStats));
      
      console.log('Complex data saved');
      Alert.alert('Success', 'Complex widget data saved!');
    } catch (error) {
      console.error('Error saving complex data:', error);
      Alert.alert('Error', 'Failed to save complex data');
    }
  };

  // Save all data at once
  const saveAllData = async () => {
    try {
      // Update stats
      const updatedStats = {
        ...widgetStats,
        lastUpdate: new Date().toISOString(),
        totalViews: widgetStats.totalViews + 1
      };
      setWidgetStats(updatedStats);

      // Save everything
      await Promise.all([
        setSharedPreference('widget_title', title),
        setSharedPreference('widget_counter', counter),
        setSharedPreference('widget_enabled', isEnabled),
        setSharedPreference('user_profile', JSON.stringify(userProfile)),
        setSharedPreference('widget_stats', JSON.stringify(updatedStats)),
        setSharedPreference('last_sync', new Date().toISOString())
      ]);

      console.log('All data saved successfully');
      Alert.alert('Success', 'All widget data synchronized!');
    } catch (error) {
      console.error('Error saving all data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  // Level up user
  const levelUpUser = () => {
    const newXp = userProfile.xp + 100;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const newAchievements = [...userProfile.achievements];
    
    if (newLevel > userProfile.level) {
      newAchievements.push(`Reached Level ${newLevel}`);
    }

    setUserProfile({
      ...userProfile,
      level: newLevel,
      xp: newXp,
      achievements: newAchievements
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    setUserProfile({
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        theme: userProfile.preferences.theme === 'light' ? 'dark' : 'light'
      }
    });
  };

  // View all stored data
  const viewAllStoredData = async () => {
    try {
      const allData = await getAllSharedPreferences();
      console.log('All stored data:', allData);
      
      // Format data for display
      const formattedData = Object.entries(allData)
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
        .join('\n');
      
      Alert.alert('Stored Data', formattedData);
    } catch (error) {
      console.error('Error retrieving all data:', error);
      Alert.alert('Error', 'Failed to retrieve data');
    }
  };

  // Clear all data
  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all widget data?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSharedPreferences();
              
              // Reset local state
              setTitle('My Widget');
              setCounter(0);
              setIsEnabled(true);
              setUserProfile({
                name: 'Demo User',
                level: 1,
                xp: 0,
                achievements: [],
                preferences: {
                  theme: 'light',
                  notifications: true,
                  autoUpdate: false
                }
              });
              setWidgetStats({
                totalViews: 0,
                lastUpdate: new Date().toISOString(),
                errorCount: 0
              });

              Alert.alert('Success', 'All data cleared!');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  // Working with custom preferences files
  const saveToCustomFile = async () => {
    try {
      const customOptions = { name: 'widget_settings' };
      
      await setSharedPreference('custom_setting', 'This is in a custom file', customOptions);
      await setSharedPreference('version', '1.0.0', customOptions);
      
      Alert.alert('Success', 'Data saved to custom preferences file!');
    } catch (error) {
      console.error('Error saving to custom file:', error);
      Alert.alert('Error', 'Failed to save to custom file');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expo Glance Widget Demo</Text>
      
      {/* Basic Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Data</Text>
        
        <Text>Widget Title:</Text>
        <TextInput 
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter widget title"
        />
        
        <View style={styles.row}>
          <Text>Counter: {counter}</Text>
          <Button title="+" onPress={() => setCounter(counter + 1)} />
          <Button title="-" onPress={() => setCounter(Math.max(0, counter - 1))} />
        </View>
        
        <View style={styles.row}>
          <Text>Widget Enabled:</Text>
          <Switch value={isEnabled} onValueChange={setIsEnabled} />
        </View>
        
        <Button title="Save Basic Data" onPress={saveBasicData} />
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        
        <Text>Name:</Text>
        <TextInput 
          style={styles.input}
          value={userProfile.name}
          onChangeText={(name) => setUserProfile({ ...userProfile, name })}
          placeholder="Enter user name"
        />
        
        <Text>Level: {userProfile.level} (XP: {userProfile.xp})</Text>
        <Button title="Level Up (+100 XP)" onPress={levelUpUser} />
        
        <Text>Theme: {userProfile.preferences.theme}</Text>
        <Button title="Toggle Theme" onPress={toggleTheme} />
        
        <Text>Achievements: {userProfile.achievements.length}</Text>
        {userProfile.achievements.map((achievement, index) => (
          <Text key={index} style={styles.achievement}>• {achievement}</Text>
        ))}
        
        <View style={styles.row}>
          <Text>Notifications:</Text>
          <Switch 
            value={userProfile.preferences.notifications} 
            onValueChange={(notifications) => 
              setUserProfile({
                ...userProfile,
                preferences: { ...userProfile.preferences, notifications }
              })
            } 
          />
        </View>
      </View>

      {/* Widget Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Widget Statistics</Text>
        
        <Text>Total Views: {widgetStats.totalViews}</Text>
        <Text>Last Update: {new Date(widgetStats.lastUpdate).toLocaleString()}</Text>
        <Text>Error Count: {widgetStats.errorCount}</Text>
        
        <Button 
          title="Simulate Error" 
          onPress={() => setWidgetStats({
            ...widgetStats, 
            errorCount: widgetStats.errorCount + 1
          })} 
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <Button title="Save Complex Data" onPress={saveComplexData} />
        <Button title="Save All Data" onPress={saveAllData} />
        <Button title="View All Stored Data" onPress={viewAllStoredData} />
        <Button title="Save to Custom File" onPress={saveToCustomFile} />
        <Button title="Reload Data" onPress={loadAllData} />
        <Button 
          title="Clear All Data" 
          onPress={clearAllData}
          color="red"
        />
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>
          1. Modify the data above{'\n'}
          2. Save the data using the buttons{'\n'}
          3. Check your Android widget to see the updates{'\n'}
          4. Widget data persists between app restarts{'\n'}
          5. Use View All Stored Data to inspect saved values
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  achievement: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
