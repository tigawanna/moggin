package com.yourpackage.widgets

import android.content.ComponentName
import android.content.Context
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.TitleBar
import androidx.glance.appwidget.provideContent
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.google.gson.Gson
import com.google.gson.JsonObject
import expo.modules.glancewidget.DataStoreHelper

// Data class for widget configuration
data class WidgetConfig(
    val theme: String,
    val showIcon: Boolean,
    val refreshInterval: Long
)

class ExampleDataStoreWidget : GlanceAppWidget() {
    // Define preference keys
    private val wakatimeHoursKey = stringPreferencesKey("wakatime_hours")
    private val widgetTitleKey = stringPreferencesKey("widget_title")
    private val widgetCountKey = stringPreferencesKey("widget_count")
    private val lastUpdateKey = stringPreferencesKey("last_update")
    private val widgetConfigKey = stringPreferencesKey("widget_config")

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            // Get values using currentState (DataStore integration)
            val wakatimeHours = currentState(key = wakatimeHoursKey) ?: "--:--"
            val widgetTitle = currentState(key = widgetTitleKey) ?: "My Widget"
            val widgetCount = currentState(key = widgetCountKey) ?: "0"
            val lastUpdate = currentState(key = lastUpdateKey) ?: "Never"
            val widgetConfigJson = currentState(key = widgetConfigKey) ?: "{}"

            // Parse JSON configuration
            val gson = Gson()
            val config = try {
                gson.fromJson(widgetConfigJson, WidgetConfig::class.java)
            } catch (e: Exception) {
                WidgetConfig("light", true, 300000)
            }

            // Create an action to open your app
            val componentName = ComponentName(context, MainActivity::class.java)
            val launchAppAction = actionStartActivity(componentName)

            GlanceTheme {
                Scaffold(
                    titleBar = {
                        TitleBar(
                            startIcon = if (config.showIcon) ImageProvider(R.drawable.main_app_icon) else null,
                            title = widgetTitle
                        )
                    },
                    backgroundColor = GlanceTheme.colors.widgetBackground
                ) {
                    Column(
                        modifier = GlanceModifier
                            .fillMaxSize()
                            .clickable(launchAppAction),
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        // Main hours display
                        Text(
                            text = wakatimeHours,
                            style = TextStyle(
                                fontSize = 64.sp,
                                color = GlanceTheme.colors.onSurface,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        
                        // Count display
                        Text(
                            text = "Count: $widgetCount",
                            style = TextStyle(
                                fontSize = 16.sp,
                                color = GlanceTheme.colors.onSurface
                            )
                        )
                        
                        // Last update display
                        Text(
                            text = "Updated: ${formatTime(lastUpdate)}",
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
    
    private fun formatTime(isoString: String): String {
        return try {
            // Format ISO string to readable time
            if (isoString == "Never") return "Never"
            isoString.substring(11, 16)
        } catch (e: Exception) {
            "Never"
        }
    }
}

class ExampleDataStoreWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = ExampleDataStoreWidget()
}

// Alternative: Direct DataStore Helper usage (if you need more control)
class DirectDataStoreWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // You can also use the DataStoreHelper directly for more complex operations
        val dataStore = DataStoreHelper.create(context)
        
        // Direct data retrieval
        val title = dataStore.getString("widget_title", "Default Title")
        val count = dataStore.getInt("widget_count", 0)
        val isEnabled = dataStore.getBoolean("widget_enabled", true)
        
        provideContent {
            if (isEnabled) {
                GlanceTheme {
                    Column(
                        modifier = GlanceModifier.fillMaxSize(),
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = title ?: "Default Title",
                            style = TextStyle(
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        Text(
                            text = "Count: $count",
                            style = TextStyle(fontSize = 16.sp)
                        )
                    }
                }
            } else {
                GlanceTheme {
                    Column(
                        modifier = GlanceModifier.fillMaxSize(),
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = "Widget Disabled",
                            style = TextStyle(fontSize = 16.sp)
                        )
                    }
                }
            }
        }
    }
}

class DirectDataStoreWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = DirectDataStoreWidget()
}
