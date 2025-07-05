package com.anonymous.moggin.wakatime

import android.content.Context
import android.os.Build
import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import com.anonymous.moggin.BidiiWidgetConstants

import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class WakatimeDataResult(
    val widgetHours: String,
    val freshHours: String? = null,
    val totalTime: String? = null, // "02 hrs : 30 mins"
    val currentProject: String? = null,
    val lastSync: String? = null,
    val error: String? = null,
    val success: Boolean = false
)

object WakatimeDataFetcher {
    
    /**
     * Fetches current widget data and fresh API data
     */
    suspend fun fetchWakatimeData(context: Context): WakatimeDataResult {
        return try {
            // Get current widget data from DataStore
            val currentPrefs = context.dataStore.data.first()
            val totalTime = currentPrefs[BidiiWidgetConstants.WAKATIME_TOTAL_TIME_KEY] ?: BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY
            val currentProject = currentPrefs[BidiiWidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] ?: "No project"
            val lastSync = currentPrefs[BidiiWidgetConstants.WAKATIME_LAST_SYNC_KEY] ?: "Never"
            
            // Get API key
            val apiKey = currentPrefs[BidiiWidgetConstants.WAKATIME_API_KEY] ?: ""
            
            if (apiKey.isNotBlank()) {
                val today = getTodayDate()
                val sdk = WakatimeSDK(apiKey)
                val response = sdk.getDurationsForDate(today)
                
                if (response.error == null) {
                    val totalHours = response.totalHours ?: 0.0
                    val formattedHours = TimeUtils.formatHours(totalHours)
                    val freshTotalTime = formatTotalTime(response.data?.data?.sumOf { it.durationInSeconds } ?: 0.0)
                    val freshCurrentProject = response.data?.data?.let { durationEntryList ->
                        getLatestProject(durationEntryList)
                    } ?: "Unknown"
                    val freshLastSync = getCurrentTimestamp()
                    
                    WakatimeDataResult(
                        widgetHours = totalTime,
                        freshHours = formattedHours,
                        totalTime = freshTotalTime,
                        currentProject = freshCurrentProject,
                        lastSync = freshLastSync,
                        success = true
                    )
                } else {
                    WakatimeDataResult(
                        widgetHours = totalTime,
                        totalTime = totalTime,
                        currentProject = currentProject,
                        lastSync = lastSync,
                        error = response.error,
                        success = false
                    )
                }
            } else {
                WakatimeDataResult(
                    widgetHours = totalTime,
                    totalTime = totalTime,
                    currentProject = currentProject,
                    lastSync = lastSync,
                    error = "No API Key",
                    success = false
                )
            }
        } catch (e: Exception) {
            Log.e("WakatimeDataFetcher", "Error fetching data", e)
            WakatimeDataResult(
                widgetHours = BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY,
                error = e.message,
                success = false
            )
        }
    }
    
    /**
     * Fetches fresh data from API and updates both DataStore and widget
     */
    suspend fun fetchAndUpdateWidget(context: Context): WakatimeDataResult {
        return try {
            val apiKey = context.dataStore.data.map { preferences ->
                preferences[BidiiWidgetConstants.WAKATIME_API_KEY] ?: ""
            }.first()
            
            if (apiKey.isBlank()) {
                return WakatimeDataResult(
                    widgetHours = BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY,
                    error = "No API Key",
                    success = false
                )
            }
            
            val today = getTodayDate()
            val sdk = WakatimeSDK(apiKey)
            val response = sdk.getDurationsForDate(today)
            
            if (response.error == null) {
                val totalHours = response.totalHours ?: 0.0
                val formattedHours = TimeUtils.formatHours(totalHours)
                val totalTime = formatTotalTime(response.data?.data?.sumOf { it.durationInSeconds } ?: 0.0)
                val currentProject = response.data?.data?.let { durationEntryList ->
                    getLatestProject(durationEntryList)
                } ?: "Unknown"
                val lastSync = getCurrentTimestamp()
                
                // Update DataStore with all the new data
                context.dataStore.edit { preferences ->
                    preferences[BidiiWidgetConstants.WAKATIME_TOTAL_TIME_KEY] = totalTime
                    preferences[BidiiWidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] = currentProject
                    preferences[BidiiWidgetConstants.WAKATIME_LAST_SYNC_KEY] = lastSync
                }
                
                // Update widget using the working pattern
                updateWidget(context, totalTime)
                
                Log.d("WakatimeDataFetcher", "Successfully updated widget with: $totalTime, project: $currentProject")
                
                WakatimeDataResult(
                    widgetHours = totalTime,
                    freshHours = formattedHours,
                    totalTime = totalTime,
                    currentProject = currentProject,
                    lastSync = lastSync,
                    success = true
                )
            } else {
                Log.e("WakatimeDataFetcher", "API Error: ${response.error}")
                WakatimeDataResult(
                    widgetHours = BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY,
                    error = response.error,
                    success = false
                )
            }
        } catch (e: Exception) {
            Log.e("WakatimeDataFetcher", "Error fetching and updating", e)
            WakatimeDataResult(
                widgetHours = BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY,
                error = e.message,
                success = false
            )
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
        return String.format(Locale.US, "%02d hrs : %02d mins", hours, minutes)
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
    
    private fun getLatestProject(data: List<DurationEntry>): String {
        // Find the entry with the latest time (most recent)
        val latestEntry = data.maxByOrNull { it.time }
        return latestEntry?.project ?: "Unknown"
    }
    
    /**
     * Updates widget with all the provided data using the working pattern from MainActivity
     */
    suspend fun updateWidget(context: Context, data: String) {
        withContext(Dispatchers.IO) {
            try {
                val glanceIds = GlanceAppWidgetManager(context).getGlanceIds(BidiiHoursWidget::class.java)
                glanceIds.forEach { id ->
                    updateAppWidgetState(context, id) { prefs ->
                        // Get the latest data from DataStore
                        val currentPrefs = context.dataStore.data.first()
                        
                        prefs[BidiiWidgetConstants.WAKATIME_TOTAL_TIME_KEY] = data
                        prefs[BidiiWidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] = 
                            currentPrefs[BidiiWidgetConstants.WAKATIME_CURRENT_PROJECT_KEY] ?: "No project"
                        prefs[BidiiWidgetConstants.WAKATIME_LAST_SYNC_KEY] = 
                            currentPrefs[BidiiWidgetConstants.WAKATIME_LAST_SYNC_KEY] ?: "Never"
                    }
                    BidiiHoursWidget().update(context, id)
                }
                Log.d("WakatimeDataFetcher", "Successfully updated widget with: $data")
            } catch (e: Exception) {
                Log.e("WakatimeDataFetcher", "Error updating widget", e)
            }
        }
    }
}


val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)