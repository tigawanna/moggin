package expo.modules.glancewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.util.Log
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
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_preferences"
}

// Improved DataStore initialization with explicit coroutine scope
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(
    name = BidiiWidgetConstants.DATASTORE_NAME,
    scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
)

class ExpoGlanceWidgetModule : Module() {
    private val context
        get() = requireNotNull(appContext.reactContext).applicationContext ?:
        requireNotNull(appContext.reactContext)

    private val activity
        get() = requireNotNull(appContext.activityProvider?.currentActivity)

    override fun definition() = ModuleDefinition {
        Name("ExpoGlanceWidgetModule")

        Constants(
            "PI" to Math.PI
        )

        AsyncFunction("getDatastoreValue") { key: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    Log.d("ExpoGlanceWidgetModule", "Fetching value for key: $key")
                    val preferences = context.dataStore.data.first()
                    val value = preferences[stringPreferencesKey(key)]
                    Log.d("ExpoGlanceWidgetModule", "Retrieved value: $value for key: $key")
                    promise.resolve(value)
                } catch (e: Exception) {
                    Log.e("ExpoGlanceWidgetModule", "Error getting value for key: $key", e)
                    promise.reject("DATASTORE_ERROR", "Failed to get value: ${e.message}", e)
                }
            }
        }

        AsyncFunction("updateDatastoreValue") { key: String, value: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    Log.d("ExpoGlanceWidgetModule", "Updating key: $key with value: $value")

                    context.dataStore.edit { settings ->
                        Log.d("ExpoGlanceWidgetModule", "Inside edit block for key: $key")
                        settings[stringPreferencesKey(key)] = value
                    }

                    Log.d("ExpoGlanceWidgetModule", "Successfully updated $key")


                    promise.resolve(null)
                } catch (e: Exception) {
                    Log.e("ExpoGlanceWidgetModule", "Error updating key: $key", e)
                    promise.reject("DATASTORE_ERROR", "Failed to update value: ${e.message}", e)
                }
            }
        }

        AsyncFunction("deleteDatastoreValue") { key: String, promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    Log.d("ExpoGlanceWidgetModule", "Deleting key: $key")
                    context.dataStore.edit { settings ->
                        settings.remove(stringPreferencesKey(key))
                    }

                    promise.resolve(null)
                } catch (e: Exception) {
                    Log.e("ExpoGlanceWidgetModule", "Error deleting key: $key", e)
                    promise.reject("DATASTORE_ERROR", "Failed to delete value: ${e.message}", e)
                }
            }
        }

        AsyncFunction("getAllDatastoreData") { promise: Promise ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    Log.d("ExpoGlanceWidgetModule", "Fetching all datastore data")
                    val preferences = context.dataStore.data.first()
                    val keys = preferences.asMap().keys.map { it.name }
                    val values = preferences.asMap().mapKeys { it.key.name }.mapValues { it.value.toString() }

                    val result = mapOf(
                        "keys" to keys,
                        "values" to values
                    )

                    Log.d("ExpoGlanceWidgetModule", "Retrieved ${keys.size} keys")
                    promise.resolve(result)
                } catch (e: Exception) {
                    Log.e("ExpoGlanceWidgetModule", "Error fetching all datastore data", e)
                    promise.reject("DATASTORE_ERROR", "Failed to get datastore data: ${e.message}", e)
                }
            }
        }
    }


}