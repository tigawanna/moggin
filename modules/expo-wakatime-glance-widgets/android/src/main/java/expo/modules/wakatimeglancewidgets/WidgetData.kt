package expo.modules.wakatimeglancewidgets

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore

import androidx.datastore.preferences.core.stringPreferencesKey

object WidgetConstants {
    const val DEFAULT_HOURS_DISPLAY = "-- hrs : -- mins"
    const val DATASTORE_NAME = "wakatime_widget_preferences"

    // WorkManager enforces a minimum interval of 15 minutes for PeriodicWorkRequest
    // For more frequent updates, users can use the manual refresh button in the widget
    const val SYNC_INTERVAL_MINUTES = 15L
    const val WAKATIME_API_KEY_STRING = "wakatime_api_key"
    val WAKATIME_API_KEY = stringPreferencesKey(this.WAKATIME_API_KEY_STRING)
    val WAKATIME_TOTAL_TIME_KEY = stringPreferencesKey("wakatime_total_time")
    val WAKATIME_CURRENT_PROJECT_KEY = stringPreferencesKey("wakatime_current_project")
    val WAKATIME_LAST_SYNC_KEY = stringPreferencesKey("wakatime_last_sync")
}

class WidgetData {
}

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = WidgetConstants.DATASTORE_NAME)
