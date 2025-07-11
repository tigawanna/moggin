package expo.modules.glancewidget

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first

/**
 * Custom DataStore configuration for your specific use case
 * Replace the constants below with your actual DataStore name
 */

// Your existing DataStore constants
object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_preferences"
    // Add other constants as needed
}

// Your existing DataStore extension
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)

/**
 * Alternative implementation that uses your existing DataStore
 * Replace the content of ExpoGlanceWidgetModule.kt with this if you want to use your existing DataStore
 */

/*
class ExpoGlanceWidgetModule : Module() {
    private val context
        get() = requireNotNull(appContext.reactContext)
        
    private val activity
        get() = requireNotNull(appContext.activityProvider?.currentActivity)

    override fun definition() = ModuleDefinition {
        Name("ExpoGlanceWidgetModule")

        Constants(
            "PI" to Math.PI
        )

        // Generic DataStore Functions using your existing DataStore
        AsyncFunction("getDatastoreValue") { key: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val preferences = context.dataStore.data.first()
                    val value = preferences[stringPreferencesKey(key)]
                    promise.resolve(value)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to get value: ${e.message}", e)
                }
            }
        }

        AsyncFunction("updateDatastoreValue") { key: String, value: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    context.dataStore.edit { settings ->
                        settings[stringPreferencesKey(key)] = value
                    }
                    promise.resolve(null)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to update value: ${e.message}", e)
                }
            }
        }

        AsyncFunction("deleteDatastoreValue") { key: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    context.dataStore.edit { settings ->
                        settings.remove(stringPreferencesKey(key))
                    }
                    promise.resolve(null)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to delete value: ${e.message}", e)
                }
            }
        }

        // Optional: Function to get all keys from DataStore
        AsyncFunction("getAllDatastoreKeys") { promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val preferences = context.dataStore.data.first()
                    val keys = preferences.asMap().keys.map { it.name }
                    promise.resolve(keys)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to get keys: ${e.message}", e)
                }
            }
        }

        // Optional: Function to get all values from DataStore
        AsyncFunction("getAllDatastoreValues") { promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val preferences = context.dataStore.data.first()
                    val values = preferences.asMap().mapKeys { it.key.name }.mapValues { it.value.toString() }
                    promise.resolve(values)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to get values: ${e.message}", e)
                }
            }
        }
    }
}
*/
