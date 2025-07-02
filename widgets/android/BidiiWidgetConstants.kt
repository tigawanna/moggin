package com.anonymous.moggin

import androidx.datastore.preferences.core.stringPreferencesKey

object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_datastore"
    val WAKATIME_HOURS_KEY = stringPreferencesKey("wakatime_hours")
    const val DEFAULT_HOURS_DISPLAY = "--:--"
}
