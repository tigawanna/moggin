import { SharedPreferencesOptions, SharedPreferencesValue } from './ExpoGlanceWidget.types';

// Simple event emitter for web
class SimpleEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  emit(eventName: string, data: any) {
    const eventListeners = this.listeners.get(eventName) || [];
    eventListeners.forEach(listener => listener(data));
  }

  addListener(eventName: string, listener: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  removeAllListeners(eventName: string) {
    this.listeners.delete(eventName);
  }
}

const emitter = new SimpleEventEmitter();

export default {
  PI: Math.PI,
  
  async setValueAsync(value: string): Promise<void> {
    emitter.emit('onChange', { value });
  },
  
  hello(): string {
    return 'Hello world! 👋';
  },

  // Shared Preferences methods (web implementation using localStorage)
  async setSharedPreferenceAsync(key: string, value: SharedPreferencesValue, options?: SharedPreferencesOptions): Promise<void> {
    const prefixedKey = getStorageKey(key, options);
    if (value === null) {
      localStorage.removeItem(prefixedKey);
    } else {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    }
  },

  async getSharedPreferenceAsync(key: string, options?: SharedPreferencesOptions): Promise<SharedPreferencesValue> {
    const prefixedKey = getStorageKey(key, options);
    const storedValue = localStorage.getItem(prefixedKey);
    if (storedValue === null) {
      return null;
    }
    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue; // Return as string if JSON parsing fails
    }
  },

  async removeSharedPreferenceAsync(key: string, options?: SharedPreferencesOptions): Promise<void> {
    const prefixedKey = getStorageKey(key, options);
    localStorage.removeItem(prefixedKey);
  },

  async clearSharedPreferencesAsync(options?: SharedPreferencesOptions): Promise<void> {
    const prefix = getStoragePrefix(options);
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  async getAllSharedPreferencesAsync(options?: SharedPreferencesOptions): Promise<Record<string, SharedPreferencesValue>> {
    const prefix = getStoragePrefix(options);
    const result: Record<string, SharedPreferencesValue> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const originalKey = key.substring(prefix.length);
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            result[originalKey] = JSON.parse(value);
          } catch {
            result[originalKey] = value;
          }
        }
      }
    }
    
    return result;
  },

  addListener(eventName: string, listener: Function): void {
    emitter.addListener(eventName, listener);
  },
  
  removeListeners(eventName: string): void {
    emitter.removeAllListeners(eventName);
  },
};

// Helper functions for web localStorage implementation
function getStoragePrefix(options?: SharedPreferencesOptions): string {
  const name = options?.name || 'expo-glance-widget';
  return `${name}:`;
}

function getStorageKey(key: string, options?: SharedPreferencesOptions): string {
  return `${getStoragePrefix(options)}${key}`;
}
