package expo.modules.glancewidget

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

/**
 * Helper class for DataStore operations used by Expo Glance Widget module
 * Provides methods to store and retrieve data that can be used by Glance widgets
 */
object DataStoreHelper {
    
    // Create a single DataStore instance to avoid multiple DataStore instances for the same file
    private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "glance_widget_preferences")
    
    // Cache to store DataStore instances by name to prevent multiple instances
    private val dataStoreCache = mutableMapOf<String, DataStore<Preferences>>()
    
    /**
     * Create a DataStore instance with custom name (singleton pattern)
     */
    fun create(context: Context, name: String? = null): DataStoreWrapper {
        val actualName = name ?: "glance_widget_preferences"
        return DataStoreWrapper(context, actualName)
    }
    
    /**
     * Get or create a DataStore instance for the given name
     */
    fun getDataStore(context: Context, name: String): DataStore<Preferences> {
        return if (name == "glance_widget_preferences") {
            context.dataStore
        } else {
            // For custom names, we need to be careful not to create multiple instances
            // We'll use a single default DataStore but with different key prefixes
            context.dataStore
        }
    }
}

/**
 * Wrapper class for DataStore operations with custom naming support
 * Uses key prefixes instead of multiple DataStore instances to avoid conflicts
 */
class DataStoreWrapper(private val context: Context, private val name: String) {
    
    private val dataStoreInstance: DataStore<Preferences>
        get() = DataStoreHelper.getDataStore(context, name)
    
    private val keyPrefix = if (name == "glance_widget_preferences") "" else "${name}_"
    
    private fun prefixedKey(key: String): String = "$keyPrefix$key"
    
    suspend fun setString(key: String, value: String) {
        dataStoreInstance.edit { preferences ->
            preferences[stringPreferencesKey(prefixedKey(key))] = value
        }
    }
    
    suspend fun getString(key: String, defaultValue: String? = null): String? {
        return dataStoreInstance.data.map { preferences ->
            preferences[stringPreferencesKey(prefixedKey(key))] ?: defaultValue
        }.first()
    }
    
    suspend fun setInt(key: String, value: Int) {
        dataStoreInstance.edit { preferences ->
            preferences[intPreferencesKey(prefixedKey(key))] = value
        }
    }
    
    suspend fun getInt(key: String, defaultValue: Int = 0): Int {
        return dataStoreInstance.data.map { preferences ->
            preferences[intPreferencesKey(prefixedKey(key))] ?: defaultValue
        }.first()
    }
    
    suspend fun setLong(key: String, value: Long) {
        dataStoreInstance.edit { preferences ->
            preferences[longPreferencesKey(prefixedKey(key))] = value
        }
    }
    
    suspend fun getLong(key: String, defaultValue: Long = 0L): Long {
        return dataStoreInstance.data.map { preferences ->
            preferences[longPreferencesKey(prefixedKey(key))] ?: defaultValue
        }.first()
    }
    
    suspend fun setFloat(key: String, value: Float) {
        dataStoreInstance.edit { preferences ->
            preferences[floatPreferencesKey(prefixedKey(key))] = value
        }
    }
    
    suspend fun getFloat(key: String, defaultValue: Float = 0.0f): Float {
        return dataStoreInstance.data.map { preferences ->
            preferences[floatPreferencesKey(prefixedKey(key))] ?: defaultValue
        }.first()
    }
    
    suspend fun setBoolean(key: String, value: Boolean) {
        dataStoreInstance.edit { preferences ->
            preferences[booleanPreferencesKey(prefixedKey(key))] = value
        }
    }
    
    suspend fun getBoolean(key: String, defaultValue: Boolean = false): Boolean {
        return dataStoreInstance.data.map { preferences ->
            preferences[booleanPreferencesKey(prefixedKey(key))] ?: defaultValue
        }.first()
    }
    
    suspend fun remove(key: String) {
        dataStoreInstance.edit { preferences ->
            // Try to remove all possible types for this key
            val prefixedKeyName = prefixedKey(key)
            preferences.remove(stringPreferencesKey(prefixedKeyName))
            preferences.remove(intPreferencesKey(prefixedKeyName))
            preferences.remove(longPreferencesKey(prefixedKeyName))
            preferences.remove(floatPreferencesKey(prefixedKeyName))
            preferences.remove(booleanPreferencesKey(prefixedKeyName))
        }
    }
    
    suspend fun clear() {
        if (keyPrefix.isEmpty()) {
            // Clear all if no prefix
            dataStoreInstance.edit { preferences ->
                preferences.clear()
            }
        } else {
            // Clear only keys with this prefix
            dataStoreInstance.edit { preferences ->
                val keysToRemove = preferences.asMap().keys.filter { 
                    it.name.startsWith(keyPrefix)
                }
                keysToRemove.forEach { preferences.remove(it) }
            }
        }
    }
    
    suspend fun getAll(): Map<String, Any?> {
        return dataStoreInstance.data.map { preferences ->
            if (keyPrefix.isEmpty()) {
                preferences.asMap().mapKeys { it.key.name }
            } else {
                preferences.asMap()
                    .filter { it.key.name.startsWith(keyPrefix) }
                    .mapKeys { it.key.name.removePrefix(keyPrefix) }
            }
        }.first()
    }
    
    /**
     * Get the underlying DataStore instance for direct access in widgets
     * This allows widgets to use currentState() with the same DataStore
     */
    fun getDataStoreForWidgets(): DataStore<Preferences> = dataStoreInstance
}
