package expo.modules.wakatimeglancewidgets

import android.content.Context
import android.content.Intent
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

data class UpdateWidgetPayload(
    val totalTime: String,
    val currentProject: String,
    val lastSync: String
) : Enumerable

class ExpoWakatimeGlanceWidgetsModule : Module() {
  private val context: Context
    get() = requireNotNull(appContext.reactContext)
  private val activity
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  override fun definition() = ModuleDefinition {
    Name("ExpoWakatimeGlanceWidgets")

    AsyncFunction("updateWakatimeWidget") { payload: UpdateWidgetPayload ->
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
  }
}
