package com.tigawanna.moggin

import androidx.datastore.preferences.core.stringPreferencesKey

object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_datastore"
    const val DEFAULT_HOURS_DISPLAY = "00 hrs : 00 mins"
    const val WORK_NAME = "wakatime_sync"
    
    // WorkManager enforces a minimum interval of 15 minutes for PeriodicWorkRequest
    // For more frequent updates, users can use the manual refresh button in the widget
    const val SYNC_INTERVAL_MINUTES = 15L
    
    val WAKATIME_API_KEY = stringPreferencesKey("wakatime_api_key")
    val WAKATIME_TOTAL_TIME_KEY = stringPreferencesKey("wakatime_total_time")
    val WAKATIME_CURRENT_PROJECT_KEY = stringPreferencesKey("wakatime_current_project")
    val WAKATIME_LAST_SYNC_KEY = stringPreferencesKey("wakatime_last_sync")
}
