package expo.modules.glancewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

// Your existing DataStore configuration
object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_preferences"
}

// Extension to create DataStore with your existing name
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)

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

        // Generic DataStore Functions
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
        // Function to get all keys and values from DataStore
        AsyncFunction("getAllDatastoreData") { promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val preferences = context.dataStore.data.first()
                    val keys = preferences.asMap().keys.map { it.name }
                    val values = preferences.asMap().mapKeys { it.key.name }.mapValues { it.value.toString() }
                    
                    val result = mapOf(
                        "keys" to keys,
                        "values" to values
                    )
                    
                    promise.resolve(result)
                } catch (e: Exception) {
                    promise.reject("DATASTORE_ERROR", "Failed to get datastore data: ${e.message}", e)
                }
            }
        }

    }

}
