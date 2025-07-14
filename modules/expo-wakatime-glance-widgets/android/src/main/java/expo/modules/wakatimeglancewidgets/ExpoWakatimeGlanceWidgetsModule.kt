package expo.modules.wakatimeglancewidgets

import android.content.Context
import android.content.Intent
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import expo.modules.wakatimeglancewidgets.hours_widget.WakatimeHoursWidget
import expo.modules.wakatimeglancewidgets.shared_utils.WidgetConstants
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
// datastore for the wakatime duration widget , directly update it to affect the hours widget
import expo.modules.wakatimeglancewidgets.hours_widget.dataStore
import androidx.datastore.preferences.core.edit

data class UpdateWidgetPayload(
    @Field val totalTime: String,
    @Field val currentProject: String,
    @Field val lastSync: String
) : Record

class ExpoWakatimeGlanceWidgetsModule : Module() {
  private val context: Context
    get() = requireNotNull(appContext.reactContext)
  private val activity
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  override fun definition() = ModuleDefinition {
    Name("ExpoWakatimeGlanceWidgets")

    AsyncFunction("updateWakatimeDailyDurationWidget") { payload: UpdateWidgetPayload ->
      CoroutineScope(Dispatchers.IO).launch {
        try {
          val glanceIds = GlanceAppWidgetManager(context).getGlanceIds(WakatimeHoursWidget::class.java)
          glanceIds.forEach { id ->
            updateAppWidgetState(context, id) { prefs ->
              // Save all the payload data to respective DataStore keys
              prefs[WidgetConstants.WAKATIME_TOTAL_TIME_KEY] = payload.totalTime
              prefs[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] = payload.currentProject
              prefs[WidgetConstants.WAKATIME_LAST_SYNC_KEY] = payload.lastSync
            }
            WakatimeHoursWidget().update(context, id)
          }
        } catch (e: Exception) {
          e.printStackTrace()
        }
      }
    }

    // Helper function to launch the main app
    Function("launchMainApp") {
      try {
        val packageManager = context.packageManager
        val intent = packageManager.getLaunchIntentForPackage(context.packageName)
        intent?.apply {
          flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                  Intent.FLAG_ACTIVITY_CLEAR_TOP or
                  Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        context.startActivity(intent)
        return@Function true
      } catch (e: Exception) {
        return@Function false
      }
    }

    AsyncFunction("updateApiKey") { apiKey: String ->
      CoroutineScope(Dispatchers.IO).launch {
        try {
          // Update all available datastores with the API key
          // Hours widget datastore
          context.dataStore.edit { preferences ->
            preferences[WidgetConstants.WAKATIME_API_KEY] = apiKey
          }
          
          // Future datastores can be added here by importing them and replicating the logic
          // Example: context.anotherDataStore.edit { preferences ->
          //   preferences[AnotherWidgetConstants.WAKATIME_API_KEY] = apiKey
          // }
          
        } catch (e: Exception) {
          e.printStackTrace()
        }
      }
    }

    AsyncFunction("removeApiKey") {
      CoroutineScope(Dispatchers.IO).launch {
        try {
          // Remove API key from all available datastores
          // Hours widget datastore
          context.dataStore.edit { preferences ->
            preferences.remove(WidgetConstants.WAKATIME_API_KEY)
          }
          
          // Future datastores can be added here by importing them and replicating the logic
          // Example: context.anotherDataStore.edit { preferences ->
          //   preferences.remove(AnotherWidgetConstants.WAKATIME_API_KEY)
          // }
          
        } catch (e: Exception) {
          e.printStackTrace()
        }
      }
    }
  }
}
