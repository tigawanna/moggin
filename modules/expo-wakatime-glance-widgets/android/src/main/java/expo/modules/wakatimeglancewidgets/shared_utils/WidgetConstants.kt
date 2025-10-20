package expo.modules.wakatimeglancewidgets.shared_utils

import androidx.datastore.preferences.core.stringPreferencesKey

object WidgetConstants {
    const val DEFAULT_HOURS_DISPLAY = "-- hrs : -- mins"
    const val DATASTORE_NAME = "wakatime_widget_preferences"
    const val SHARED_PREFS_NAME = "wakatime_widget_preferences"

    const val WORK_NAME = "wakatime_sync"

    // WorkManager enforces a minimum interval of 15 minutes for PeriodicWorkRequest
    // For more frequent updates, users can use the manual refresh button in the widget
    const val SYNC_INTERVAL_MINUTES = 15L
    const val WAKATIME_API_KEY_STRING = "wakatime_api_key"
    val WAKATIME_API_KEY = stringPreferencesKey(WAKATIME_API_KEY_STRING)
    val WAKATIME_TOTAL_TIME_KEY = stringPreferencesKey("wakatime_total_time")
    val WAKATIME_CURRENT_PROJECT_KEY = stringPreferencesKey("wakatime_current_project")
    val WAKATIME_LAST_SYNC_KEY = stringPreferencesKey("wakatime_last_sync")
}




