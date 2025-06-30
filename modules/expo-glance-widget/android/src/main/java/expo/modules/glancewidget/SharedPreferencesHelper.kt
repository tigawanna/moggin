package expo.modules.glancewidget

import android.content.Context
import android.content.SharedPreferences

/**
 * Utility class for accessing SharedPreferences from Kotlin code (especially useful in widgets)
 * This provides the same functionality as the JavaScript API but for native Android code.
 */
class SharedPreferencesHelper(private val context: Context, private val preferencesName: String? = null) {
    
    private val sharedPreferences: SharedPreferences by lazy {
        val name = preferencesName ?: context.packageName
        context.getSharedPreferences(name, Context.MODE_PRIVATE)
    }

    /**
     * Set a string value
     */
    fun setString(key: String, value: String?) {
        sharedPreferences.edit().putString(key, value).apply()
    }

    /**
     * Get a string value
     */
    fun getString(key: String, defaultValue: String? = null): String? {
        return sharedPreferences.getString(key, defaultValue)
    }

    /**
     * Set an integer value
     */
    fun setInt(key: String, value: Int) {
        sharedPreferences.edit().putInt(key, value).apply()
    }

    /**
     * Get an integer value
     */
    fun getInt(key: String, defaultValue: Int = 0): Int {
        return sharedPreferences.getInt(key, defaultValue)
    }

    /**
     * Set a long value
     */
    fun setLong(key: String, value: Long) {
        sharedPreferences.edit().putLong(key, value).apply()
    }

    /**
     * Get a long value
     */
    fun getLong(key: String, defaultValue: Long = 0L): Long {
        return sharedPreferences.getLong(key, defaultValue)
    }

    /**
     * Set a float value
     */
    fun setFloat(key: String, value: Float) {
        sharedPreferences.edit().putFloat(key, value).apply()
    }

    /**
     * Get a float value
     */
    fun getFloat(key: String, defaultValue: Float = 0f): Float {
        return sharedPreferences.getFloat(key, defaultValue)
    }

    /**
     * Set a boolean value
     */
    fun setBoolean(key: String, value: Boolean) {
        sharedPreferences.edit().putBoolean(key, value).apply()
    }

    /**
     * Get a boolean value
     */
    fun getBoolean(key: String, defaultValue: Boolean = false): Boolean {
        return sharedPreferences.getBoolean(key, defaultValue)
    }

    /**
     * Remove a key
     */
    fun remove(key: String) {
        sharedPreferences.edit().remove(key).apply()
    }

    /**
     * Clear all preferences
     */
    fun clear() {
        sharedPreferences.edit().clear().apply()
    }

    /**
     * Check if a key exists
     */
    fun contains(key: String): Boolean {
        return sharedPreferences.contains(key)
    }

    /**
     * Get all key-value pairs
     */
    fun getAll(): Map<String, *> {
        return sharedPreferences.all
    }

    companion object {
        /**
         * Create a SharedPreferencesHelper with default preferences name (package name)
         */
        fun create(context: Context): SharedPreferencesHelper {
            return SharedPreferencesHelper(context)
        }

        /**
         * Create a SharedPreferencesHelper with custom preferences name
         */
        fun create(context: Context, preferencesName: String): SharedPreferencesHelper {
            return SharedPreferencesHelper(context, preferencesName)
        }
    }
}
