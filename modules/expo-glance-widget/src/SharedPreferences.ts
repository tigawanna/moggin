import { SharedPreferencesOptions, SharedPreferencesValue } from './ExpoGlanceWidget.types';
import ExpoGlanceWidgetModule from './ExpoGlanceWidgetModule';

/**
 * Shared Preferences API for Android Glance Widgets
 * Provides a simple interface for storing and retrieving key-value pairs
 * that can be accessed from both JavaScript and Kotlin widget code.
 */
export class SharedPreferences {
  private static defaultOptions: SharedPreferencesOptions = {};

  /**
   * Set a value in shared preferences
   * @param key The key to store the value under
   * @param value The value to store (string, number, boolean, or null)
   * @param options Optional configuration (e.g., custom preferences file name)
   */
  static async set(key: string, value: SharedPreferencesValue, options: SharedPreferencesOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.setSharedPreferenceAsync(key, value, { ...this.defaultOptions, ...options });
  }

  /**
   * Get a value from shared preferences
   * @param key The key to retrieve
   * @param options Optional configuration (e.g., custom preferences file name)
   * @returns The stored value or null if not found
   */
  static async get(key: string, options: SharedPreferencesOptions = {}): Promise<SharedPreferencesValue> {
    return ExpoGlanceWidgetModule.getSharedPreferenceAsync(key, { ...this.defaultOptions, ...options });
  }

  /**
   * Remove a key-value pair from shared preferences
   * @param key The key to remove
   * @param options Optional configuration (e.g., custom preferences file name)
   */
  static async remove(key: string, options: SharedPreferencesOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.removeSharedPreferenceAsync(key, { ...this.defaultOptions, ...options });
  }

  /**
   * Clear all shared preferences
   * @param options Optional configuration (e.g., custom preferences file name)
   */
  static async clear(options: SharedPreferencesOptions = {}): Promise<void> {
    return ExpoGlanceWidgetModule.clearSharedPreferencesAsync({ ...this.defaultOptions, ...options });
  }

  /**
   * Get all key-value pairs from shared preferences
   * @param options Optional configuration (e.g., custom preferences file name)
   * @returns An object containing all stored key-value pairs
   */
  static async getAll(options: SharedPreferencesOptions = {}): Promise<Record<string, SharedPreferencesValue>> {
    return ExpoGlanceWidgetModule.getAllSharedPreferencesAsync({ ...this.defaultOptions, ...options });
  }

  /**
   * Set default options for all SharedPreferences operations
   * @param options Default options to use
   */
  static setDefaultOptions(options: SharedPreferencesOptions): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }
}

// Export convenience functions for direct use
export const setSharedPreference = SharedPreferences.set.bind(SharedPreferences);
export const getSharedPreference = SharedPreferences.get.bind(SharedPreferences);
export const removeSharedPreference = SharedPreferences.remove.bind(SharedPreferences);
export const clearSharedPreferences = SharedPreferences.clear.bind(SharedPreferences);
export const getAllSharedPreferences = SharedPreferences.getAll.bind(SharedPreferences);
