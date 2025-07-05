package com.anonymous.moggin

import android.content.ComponentName

import android.content.Context
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.Preferences
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.Image
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.TitleBar
import androidx.glance.appwidget.provideContent
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.state.GlanceStateDefinition
import androidx.glance.state.PreferencesGlanceStateDefinition
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.anonymous.moggin.utils.WakatimeDataFetcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import android.util.Log
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.unit.dp
import androidx.glance.Button
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.layout.padding

class RefreshWidgetAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        Log.d("RefreshWidgetAction", "Refresh button clicked")
        
        // Launch coroutine to fetch and update widget data
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val result = WakatimeDataFetcher.fetchAndUpdateWidget(context)
                Log.d("RefreshWidgetAction", "Widget refresh completed: success=${result.success}")
            } catch (e: Exception) {
                Log.e("RefreshWidgetAction", "Error refreshing widget", e)
            }
        }
    }
}

class BidiiHoursWidget : GlanceAppWidget() {
    override var stateDefinition: GlanceStateDefinition<*> = PreferencesGlanceStateDefinition



    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val prefs = currentState<Preferences>()


            
            val totalTime = prefs[BidiiWidgetConstants.WAKATIME_TOTAL_TIME_KEY]
                ?: "00 hrs : 00 mins"
            
            val currentProject = prefs[BidiiWidgetConstants.WAKATIME_CURRENT_PROJECT_KEY]
                ?: "No project"
            
            val lastSync = prefs[BidiiWidgetConstants.WAKATIME_LAST_SYNC_KEY]
                ?: "Never"

            val launchAppAction = actionStartActivity(
                ComponentName(context, MainActivity::class.java)
            )


            GlanceTheme {
                Scaffold(
                    titleBar = {
                        TitleBar(
                            startIcon = ImageProvider(R.drawable.main_app_icon),
                            title = "Wakatime",
                            actions = {
                                // Refresh button in top right corner
                                Image(
                                    provider = ImageProvider(R.drawable.refresh),
                                    contentDescription = "Refresh",
                                    modifier = GlanceModifier
                                        .clickable(actionRunCallback<RefreshWidgetAction>())
                                        .padding(end = 16.dp) // Adds 16dp margin to the right (end)
                                )
                            }
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
                            text = totalTime,
                            style = TextStyle(
                                fontSize = 24.sp,
                                color = GlanceTheme.colors.onSurface,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        
                        // Current project
                        Text(
                            text = "📁 $currentProject",
                            style = TextStyle(
                                fontSize = 12.sp,
                                color = GlanceTheme.colors.onSurfaceVariant
                            )
                        )
                        
                        // Last sync time
                        Text(
                            text = "🔄 $lastSync",
                            style = TextStyle(
                                fontSize = 10.sp,
                                color = GlanceTheme.colors.onSurfaceVariant
                            )
                        )
                    }
                }
            }
        }
    }
}

class BidiiHoursWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = BidiiHoursWidget()
}
