package expo.modules.wakatimeglancewidgets.hours_widget

import android.content.Context
import android.os.Build
import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.wakatimeglancewidgets.data_utils.DurationEntry
import expo.modules.wakatimeglancewidgets.data_utils.WakatimeSDK
import expo.modules.wakatimeglancewidgets.shared_utils.TimeUtils
import expo.modules.wakatimeglancewidgets.shared_utils.WidgetConstants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class WakatimeDataResult(
    val widgetHours: String, // Represents the data currently shown or last shown on the widget
    val freshHours: String? = null, // Formatted hours string from the latest API fetch
    val totalTime: String? = null, // Formatted "XX hrs : XX mins" from latest API fetch (if successful)
    val currentProject: String? = null, // Current project from latest API fetch (if successful)
    val lastSync: String? = null, // Timestamp of the last successful sync
    val error: String? = null,
    val success: Boolean = false // Indicates if the fresh API data fetch was successful
)

object WakatimeDataFetcher {

    /**
     * Fetches the daily coding duration from WakaTime API.
     * It first tries to get the API key from DataStore, and if not found,
     * falls back to SharedPreferences.
     * It also retrieves currently stored widget data to return as part of the result.
     */
    suspend fun fetchWakatimeDailyDuration(context: Context): WakatimeDataResult {
        // Get current widget data from DataStore (what's potentially displayed or last known)
        val currentPrefs = context.dataStore.data.first()
        val currentlyDisplayedTotalTime = currentPrefs[WidgetConstants.WAKATIME_TOTAL_TIME_KEY] ?: WidgetConstants.DEFAULT_HOURS_DISPLAY
        val currentlyDisplayedProject = currentPrefs[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] ?: "No project"
        val currentlyDisplayedLastSync = currentPrefs[WidgetConstants.WAKATIME_LAST_SYNC_KEY] ?: "Never"

        try {
            // Attempt to get API key from DataStore first
            var apiKey = currentPrefs[WidgetConstants.WAKATIME_API_KEY]

            // If not found in DataStore, try SharedPreferences
            if (apiKey.isNullOrBlank()) {
                Log.d("WakatimeDataFetcher", "API key not found in DataStore, trying SharedPreferences.")
                // Ensure you have a constant for your SharedPreferences file name
                // For example, in WidgetConstants: const val SHARED_PREFS_NAME = "wakatime_shared_prefs"
                // And ensure WAKATIME_API_KEY_STRING is the correct key for SharedPreferences
                val sharedPrefs = context.getSharedPreferences(WidgetConstants.SHARED_PREFS_NAME, Context.MODE_PRIVATE)
                apiKey = sharedPrefs.getString(WidgetConstants.WAKATIME_API_KEY_STRING, null)
            }

            if (apiKey.isNullOrBlank()) {
                Log.w("WakatimeDataFetcher", "API Key is not available in DataStore or SharedPreferences.")
                return WakatimeDataResult(
                    widgetHours = currentlyDisplayedTotalTime,
                    totalTime = currentlyDisplayedTotalTime, // No fresh data, so return current
                    currentProject = currentlyDisplayedProject,
                    lastSync = currentlyDisplayedLastSync,
                    error = "No API Key",
                    success = false
                )
            }

            // API key is available, proceed to fetch data
            val today = getTodayDate()
            val sdk = WakatimeSDK(apiKey)
            val response = sdk.getDurationsForDate(today)

            return if (response.error == null && response.data != null) {
                val totalSeconds = response.data.data.sumOf { it.durationInSeconds }
                val freshFormattedHours = TimeUtils.formatHours(
                    response.totalHours ?: 0.0
                ) // Assuming totalHours is in decimal format
                val freshTotalTimeFormatted = formatTotalTime(totalSeconds)
                val freshCurrentProject = getLatestProject(response.data.data) ?: "Unknown"
                val freshLastSyncTimestamp = "${getCurrentTimestamp()} ⚡"

                WakatimeDataResult(
                    widgetHours = currentlyDisplayedTotalTime, // This is what was on the widget before this fetch
                    freshHours = freshFormattedHours,
                    totalTime = freshTotalTimeFormatted,
                    currentProject = freshCurrentProject,
                    lastSync = freshLastSyncTimestamp,
                    success = true
                )
            } else {
                Log.e("WakatimeDataFetcher", "API Error: ${response.error}")
                WakatimeDataResult(
                    widgetHours = currentlyDisplayedTotalTime,
                    totalTime = currentlyDisplayedTotalTime, // API failed, return current
                    currentProject = currentlyDisplayedProject,
                    lastSync = currentlyDisplayedLastSync,
                    error = response.error ?: "Unknown API error",
                    success = false
                )
            }
        } catch (e: Exception) {
            Log.e("WakatimeDataFetcher", "Error in fetchWakatimeDailyDuration", e)
            return WakatimeDataResult(
                widgetHours = currentlyDisplayedTotalTime, // Exception, return current
                totalTime = currentlyDisplayedTotalTime,
                currentProject = currentlyDisplayedProject,
                lastSync = currentlyDisplayedLastSync,
                error = e.message ?: "Failed to fetch data due to an unexpected error.",
                success = false
            )
        }
    }

    /**
     * Fetches fresh data using fetchWakatimeDailyDuration,
     * updates DataStore if successful, and then updates the widget.
     */
    suspend fun fetchAndUpdateWidget(context: Context): WakatimeDataResult {
        val fetchDataResult = fetchWakatimeDailyDuration(context)

        if (fetchDataResult.success && fetchDataResult.totalTime != null && fetchDataResult.currentProject != null && fetchDataResult.lastSync != null) {
            try {
                // Update DataStore with the new fresh data
                context.dataStore.edit { preferences ->
                    preferences[WidgetConstants.WAKATIME_TOTAL_TIME_KEY] = fetchDataResult.totalTime
                    preferences[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] = fetchDataResult.currentProject
                    preferences[WidgetConstants.WAKATIME_LAST_SYNC_KEY] = fetchDataResult.lastSync
                    // Optionally update the API key in DataStore if it was fetched from SharedPreferences
                    // and you want DataStore to be the primary source moving forward.
                    // val currentApiKey = context.dataStore.data.first()[WidgetConstants.WAKATIME_API_KEY]
                    // if (currentApiKey.isNullOrBlank() && !fetchDataResult.apiKeyUsedInFetch.isNullOrBlank()){
                    //     preferences[WidgetConstants.WAKATIME_API_KEY] = fetchDataResult.apiKeyUsedInFetch
                    // }
                }

                // Update widget using the new total time
                // The updateWidget function will read the other details (project, lastSync) from DataStore
                updateWidget(context, fetchDataResult.totalTime)

                Log.d("WakatimeDataFetcher", "Successfully fetched, updated DataStore, and updated widget with: ${fetchDataResult.totalTime}, project: ${fetchDataResult.currentProject}")
                return fetchDataResult // Return the successful result
            } catch (e: Exception) {
                Log.e("WakatimeDataFetcher", "Error updating DataStore or widget after successful fetch", e)
                // Return the fetchDataResult but indicate overall process might have had issues post-fetch
                return fetchDataResult.copy(
                    error = (fetchDataResult.error?.let { "$it; " } ?: "") + "Failed to update storage/widget: ${e.message}",
                    // success remains true for the fetch part, but the caller might want to know about subsequent errors
                )
            }
        } else {
            // Fetch was not successful or data was incomplete, log and return the result from fetchWakatimeDailyDuration
            Log.w("WakatimeDataFetcher", "Skipping DataStore and widget update because fetchWakatimeDailyDuration was not successful or data was incomplete. Error: ${fetchDataResult.error}")
            // If the widget shows "No API Key" or an error, we might not want to update it
            // with the same error message if the fetch failed for the same reason.
            // However, if there was a transient error, updateWidget could reflect that.
            // For simplicity, we are returning the original fetch result.
            // Consider if you want to update the widget to show an error state here.
            return fetchDataResult
        }
    }

    private fun getTodayDate(): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
        } else {
            val formatter = java.text.SimpleDateFormat("yyyy-MM-dd", Locale.US)
            formatter.format(java.util.Date())
        }
    }

    private fun formatTotalTime(totalSeconds: Double): String {
        val hours = (totalSeconds / 3600).toInt()
        val minutes = ((totalSeconds % 3600) / 60).toInt()
        return String.format(Locale.US, "%02dh %02dm", hours, minutes)
    }

    private fun getCurrentTimestamp(): String {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val now = java.time.LocalDateTime.now()
            now.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, HH:mm"))
        } else {
            val formatter = java.text.SimpleDateFormat("MMM dd, HH:mm", Locale.US)
            formatter.format(java.util.Date())
        }
    }

    private fun getLatestProject(data: List<DurationEntry>): String? {
        // Find the entry with the latest time (most recent)
        return data.maxByOrNull { it.time }?.project
    }

    /**
     * Updates widget. It reads the latest comprehensive data from DataStore.
     * The `data` parameter (totalTime) is specifically passed to ensure the widget updates
     * with this primary piece of information immediately after a fetch.
     */
    suspend fun updateWidget(context: Context, totalTime: String) {
        withContext(Dispatchers.IO) {
            try {
                val glanceIds = GlanceAppWidgetManager(context).getGlanceIds(WakatimeHoursWidget::class.java)
                if (glanceIds.isEmpty()) {
                    Log.d("WakatimeDataFetcher", "No glance IDs found for WakatimeHoursWidget. Skipping widget update.")
                    return@withContext
                }
                glanceIds.forEach { id ->
                    updateAppWidgetState(context, id) { prefs ->
                        // Get the latest full data from DataStore
                        val currentDataStorePrefs = context.dataStore.data.first()

                        prefs[WidgetConstants.WAKATIME_TOTAL_TIME_KEY] = totalTime // Use the freshly fetched totalTime
                        prefs[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] =
                            currentDataStorePrefs[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] ?: "No project"
                        prefs[WidgetConstants.WAKATIME_LAST_SYNC_KEY] =
                            currentDataStorePrefs[WidgetConstants.WAKATIME_LAST_SYNC_KEY] ?: "Never"
                        prefs[WidgetConstants.WAKATIME_API_KEY] = // This is likely for display/debug in widget
                            currentDataStorePrefs[WidgetConstants.WAKATIME_API_KEY] ?: "🔑 N/A"
                    }
                    WakatimeHoursWidget().update(context, id)
                }
                Log.d("WakatimeDataFetcher", "Successfully triggered widget update for all instances with totalTime: $totalTime")
            } catch (e: Exception) {
                Log.e("WakatimeDataFetcher", "Error updating widget", e)
            }
        }
    }
}

// Assuming WidgetConstants and WakatimeSDK, DurationEntry, TimeUtils are defined elsewhere
// e.g.
// object WidgetConstants {
//     const val DATASTORE_NAME = "wakatime_widget_prefs"
//     const val SHARED_PREFS_NAME = "wakatime_shared_prefs" // Added for clarity
//     val WAKATIME_TOTAL_TIME_KEY = stringPreferencesKey("wakatime_total_time")
//     val WAKATIME_CURRENT_PROJECT_KEY = stringPreferencesKey("wakatime_current_project")
//     val WAKATIME_LAST_SYNC_KEY = stringPreferencesKey("wakatime_last_sync")
//     val WAKATIME_API_KEY = stringPreferencesKey("wakatime_api_key") // For DataStore
//     const val WAKATIME_API_KEY_STRING = "wakatime_api_key_string" // Key name for SharedPreferences
//     const val DEFAULT_HOURS_DISPLAY = "-- hrs : -- mins"
// }
// class WakatimeSDK(apiKey: String) { /* ... */ data class DurationsResponse(val data: DurationsData?, val totalHours: Double?, val error: String?) data class DurationsData(val data: List<DurationEntry>) }
// data class DurationEntry(val durationInSeconds: Double, val project: String?, val time: Double)
// object TimeUtils { fun formatHours(hours: Double): String { /* ... */ return "formatted $hours" } }

//val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = WidgetConstants.DATASTORE_NAME)
