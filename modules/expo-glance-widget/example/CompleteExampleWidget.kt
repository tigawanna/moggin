package com.example.widgets

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.appwidget.*
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.TitleBar
import androidx.glance.layout.*
import androidx.glance.text.*
import androidx.glance.Image
import androidx.glance.ImageProvider
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import expo.modules.glancewidget.SharedPreferencesHelper
import java.text.SimpleDateFormat
import java.util.*

// Data classes matching the TypeScript interfaces
data class UserProfile(
    val name: String = "Demo User",
    val level: Int = 1,
    val xp: Int = 0,
    val achievements: List<String> = emptyList(),
    val preferences: UserPreferences = UserPreferences()
)

data class UserPreferences(
    val theme: String = "light",
    val notifications: Boolean = true,
    val autoUpdate: Boolean = false
)

data class WidgetStats(
    val totalViews: Int = 0,
    val lastUpdate: String = "",
    val errorCount: Int = 0
)

/**
 * Complete example widget demonstrating all SharedPreferences features
 * This widget reads data saved from the React Native app
 */
class CompleteExampleWidget : GlanceAppWidget() {
    
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val sharedPrefs = SharedPreferencesHelper.create(context)
        val gson = Gson()
        
        // Load all data from SharedPreferences
        val widgetData = loadWidgetData(sharedPrefs, gson)
        
        provideContent {
            GlanceTheme {
                WidgetContent(widgetData)
            }
        }
    }
    
    private fun loadWidgetData(
        sharedPrefs: SharedPreferencesHelper, 
        gson: Gson
    ): WidgetData {
        return try {
            // Load simple values
            val title = sharedPrefs.getString("widget_title", "My Widget")
            val counter = sharedPrefs.getInt("widget_counter", 0)
            val isEnabled = sharedPrefs.getBoolean("widget_enabled", true)
            val lastSync = sharedPrefs.getString("last_sync", "")
            
            // Load complex JSON data
            val userProfile = try {
                val profileJson = sharedPrefs.getString("user_profile", "{}")
                gson.fromJson(profileJson, UserProfile::class.java) ?: UserProfile()
            } catch (e: JsonSyntaxException) {
                UserProfile()
            }
            
            val widgetStats = try {
                val statsJson = sharedPrefs.getString("widget_stats", "{}")
                gson.fromJson(statsJson, WidgetStats::class.java) ?: WidgetStats()
            } catch (e: JsonSyntaxException) {
                WidgetStats()
            }
            
            WidgetData(
                title = title ?: "My Widget",
                counter = counter,
                isEnabled = isEnabled,
                userProfile = userProfile,
                widgetStats = widgetStats,
                lastSync = lastSync ?: ""
            )
        } catch (e: Exception) {
            // Return default data if loading fails
            WidgetData()
        }
    }
}

data class WidgetData(
    val title: String = "My Widget",
    val counter: Int = 0,
    val isEnabled: Boolean = true,
    val userProfile: UserProfile = UserProfile(),
    val widgetStats: WidgetStats = WidgetStats(),
    val lastSync: String = ""
)

@Composable
private fun WidgetContent(data: WidgetData) {
    val isDarkTheme = data.userProfile.preferences.theme == "dark"
    val backgroundColor = if (isDarkTheme) 
        GlanceTheme.colors.background 
    else 
        Color.White
    
    Scaffold(
        titleBar = {
            TitleBar(
                title = data.title,
                textColor = if (isDarkTheme) Color.White else Color.Black
            )
        },
        backgroundColor = backgroundColor
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.Vertical.Top,
            horizontalAlignment = Alignment.Horizontal.Start
        ) {
            // Status indicator
            StatusRow(data.isEnabled, isDarkTheme)
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            // Counter display
            CounterSection(data.counter, isDarkTheme)
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            // User info
            UserSection(data.userProfile, isDarkTheme)
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            // Stats section
            StatsSection(data.widgetStats, isDarkTheme)
            
            Spacer(modifier = GlanceModifier.height(8.dp))
            
            // Last sync
            if (data.lastSync.isNotEmpty()) {
                SyncInfo(data.lastSync, isDarkTheme)
            }
        }
    }
}

@Composable
private fun StatusRow(isEnabled: Boolean, isDarkTheme: Boolean) {
    Row(
        modifier = GlanceModifier.fillMaxWidth(),
        horizontalAlignment = Alignment.Horizontal.Start,
        verticalAlignment = Alignment.Vertical.CenterVertically
    ) {
        Text(
            text = if (isEnabled) "🟢" else "🔴",
            style = TextStyle(fontSize = 16.sp)
        )
        Spacer(modifier = GlanceModifier.width(4.dp))
        Text(
            text = if (isEnabled) "Active" else "Disabled",
            style = TextStyle(
                fontSize = 14.sp,
                color = if (isDarkTheme) Color.White else Color.Black
            )
        )
    }
}

@Composable
private fun CounterSection(counter: Int, isDarkTheme: Boolean) {
    Column {
        Text(
            text = "Counter",
            style = TextStyle(
                fontSize = 12.sp,
                color = if (isDarkTheme) Color.Gray else Color.DarkGray
            )
        )
        Text(
            text = counter.toString(),
            style = TextStyle(
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = if (isDarkTheme) Color.White else Color.Black
            )
        )
    }
}

@Composable
private fun UserSection(userProfile: UserProfile, isDarkTheme: Boolean) {
    Column {
        Text(
            text = "User: ${userProfile.name}",
            style = TextStyle(
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = if (isDarkTheme) Color.White else Color.Black
            )
        )
        
        Row(
            horizontalAlignment = Alignment.Horizontal.Start,
            verticalAlignment = Alignment.Vertical.CenterVertically
        ) {
            Text(
                text = "Lv.${userProfile.level}",
                style = TextStyle(
                    fontSize = 12.sp,
                    color = if (isDarkTheme) Color.Cyan else Color.Blue
                )
            )
            Spacer(modifier = GlanceModifier.width(8.dp))
            Text(
                text = "${userProfile.xp} XP",
                style = TextStyle(
                    fontSize = 12.sp,
                    color = if (isDarkTheme) Color.Gray else Color.DarkGray
                )
            )
        }
        
        if (userProfile.achievements.isNotEmpty()) {
            Text(
                text = "🏆 ${userProfile.achievements.size} achievements",
                style = TextStyle(
                    fontSize = 11.sp,
                    color = if (isDarkTheme) Color.Yellow else Color(0xFFFF9800)
                )
            )
        }
    }
}

@Composable
private fun StatsSection(stats: WidgetStats, isDarkTheme: Boolean) {
    Column {
        Text(
            text = "Statistics",
            style = TextStyle(
                fontSize = 12.sp,
                color = if (isDarkTheme) Color.Gray else Color.DarkGray
            )
        )
        
        Row(
            modifier = GlanceModifier.fillMaxWidth(),
            horizontalAlignment = Alignment.Horizontal.Start
        ) {
            Text(
                text = "Views: ${stats.totalViews}",
                style = TextStyle(
                    fontSize = 11.sp,
                    color = if (isDarkTheme) Color.White else Color.Black
                )
            )
            Spacer(modifier = GlanceModifier.width(12.dp))
            if (stats.errorCount > 0) {
                Text(
                    text = "Errors: ${stats.errorCount}",
                    style = TextStyle(
                        fontSize = 11.sp,
                        color = Color.Red
                    )
                )
            }
        }
    }
}

@Composable
private fun SyncInfo(lastSync: String, isDarkTheme: Boolean) {
    val formattedTime = formatSyncTime(lastSync)
    Text(
        text = "Synced: $formattedTime",
        style = TextStyle(
            fontSize = 10.sp,
            color = if (isDarkTheme) Color.Gray else Color.DarkGray
        )
    )
}

private fun formatSyncTime(isoString: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val outputFormat = SimpleDateFormat("MMM dd, HH:mm", Locale.getDefault())
        val date = inputFormat.parse(isoString)
        date?.let { outputFormat.format(it) } ?: "Unknown"
    } catch (e: Exception) {
        "Unknown"
    }
}

/**
 * Widget receiver class
 */
class CompleteExampleWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = CompleteExampleWidget()
}

/**
 * Alternative widget showing how to work with custom SharedPreferences files
 */
class CustomPreferencesWidget : GlanceAppWidget() {
    
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Using custom preferences file name
        val customPrefs = SharedPreferencesHelper.create(context, "widget_settings")
        
        val customSetting = customPrefs.getString("custom_setting", "No custom data")
        val version = customPrefs.getString("version", "Unknown")
        
        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalAlignment = Alignment.Vertical.CenterVertically,
                    horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                ) {
                    Text(
                        text = "Custom Settings",
                        style = TextStyle(
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    
                    Spacer(modifier = GlanceModifier.height(8.dp))
                    
                    Text(
                        text = customSetting ?: "No data",
                        style = TextStyle(fontSize = 14.sp)
                    )
                    
                    Text(
                        text = "Version: ${version ?: "Unknown"}",
                        style = TextStyle(
                            fontSize = 12.sp,
                            color = GlanceTheme.colors.onSurface.copy(alpha = 0.7f)
                        )
                    )
                }
            }
        }
    }
}

class CustomPreferencesWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = CustomPreferencesWidget()
}
