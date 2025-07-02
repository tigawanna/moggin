import { DataStoreOptions, DataStoreValue } from './ExpoGlanceWidget.types';
import ExpoGlanceWidgetModule from './ExpoGlanceWidgetModule';

/**
 * DataStore API for Android Glance Widgets
 * Provides a modern interface for storing and retrieving key-value pairs
 * that can be accessed from both JavaScript and Kotlin widget code using DataStore.
 * 
 * DataStore is the recommended replacement for SharedPreferences and works
 * seamlessly with Glance widgets using currentState().
 */
export class DataStore {
  private static defaultOptions: DataStoreOptions = {};

  /**
   * Set a value in DataStore
   * @param key The key to store the value under
   * @param value The value to store (string, number, boolean, or null)
   * @param options Optional configuration (e.g., custom DataStore name)
   */
  static async set(key: string, value: DataStoreValue, options: DataStoreOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.setDataStoreAsync(key, value, { ...this.defaultOptions, ...options });
  }

  /**
   * Get a value from DataStore
   * @param key The key to retrieve
   * @param options Optional configuration (e.g., custom DataStore name)
   * @returns The stored value or null if not found
   */
  static async get(key: string, options: DataStoreOptions = {}): Promise<DataStoreValue> {
    return ExpoGlanceWidgetModule.getDataStoreAsync(key, { ...this.defaultOptions, ...options });
  }

  /**
   * Remove a key-value pair from DataStore
   * @param key The key to remove
   * @param options Optional configuration (e.g., custom DataStore name)
   */
  static async remove(key: string, options: DataStoreOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.removeDataStoreAsync(key, { ...this.defaultOptions, ...options });
  }

  /**
   * Clear all DataStore preferences
   * @param options Optional configuration (e.g., custom DataStore name)
   */
  static async clear(options: DataStoreOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.clearDataStoreAsync({ ...this.defaultOptions, ...options });
  }

  /**
   * Get all key-value pairs from DataStore
   * @param options Optional configuration (e.g., custom DataStore name)
   * @returns An object containing all stored key-value pairs
   */
  static async getAll(options: DataStoreOptions = {}): Promise<Record<string, DataStoreValue>> {
    return ExpoGlanceWidgetModule.getAllDataStoreAsync({ ...this.defaultOptions, ...options });
  }

  /**
   * Set default options for all DataStore operations
   * @param options Default options to use
   */
  static setDefaultOptions(options: DataStoreOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// Export convenience functions for direct use
export const setDataStore = DataStore.set.bind(DataStore);
export const getDataStore = DataStore.get.bind(DataStore);
export const removeDataStore = DataStore.remove.bind(DataStore);
export const clearDataStore = DataStore.clear.bind(DataStore);
export const getAllDataStore = DataStore.getAll.bind(DataStore);
