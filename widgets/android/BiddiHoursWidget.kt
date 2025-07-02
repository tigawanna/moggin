package com.anonymous.moggin

import android.content.ComponentName
import android.util.Log
import android.content.Context
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.Preferences
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
import androidx.glance.state.GlanceStateDefinition
import androidx.glance.state.PreferencesGlanceStateDefinition
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle

class BidiiHoursWidget : GlanceAppWidget() {
    override var stateDefinition: GlanceStateDefinition<*> = PreferencesGlanceStateDefinition

    companion object {
        private const val TAG = "BidiiHoursWidget"
    }

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val prefs = currentState<Preferences>()
            Log.d(TAG, "provideGlance: Preferences retrieved: $prefs")
            val wakatimeHours = prefs[BidiiWidgetConstants.WAKATIME_HOURS_KEY]
                ?: BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY

            val launchAppAction = actionStartActivity(
                ComponentName(context, MainActivity::class.java)
            )

            Log.d(TAG, "provideGlance: wakatimeHours = $wakatimeHours")
            Log.d(TAG, "provideGlance: launchAppAction = $launchAppAction")
            GlanceTheme {
                Scaffold(
                    titleBar = {
                        TitleBar(
                            startIcon = ImageProvider(R.drawable.main_app_icon),
                            title = "Wakatime Hours"
                        )
                    },
                    backgroundColor = GlanceTheme.colors.widgetBackground
                ) {
                    Column(
                        modifier = GlanceModifier
                            .fillMaxSize()
                            .clickable(launchAppAction),
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                    ) {
                        Text(
                            text = wakatimeHours,
                            style = TextStyle(
                                fontSize = 64.sp,
                                color = GlanceTheme.colors.onSurface,
                                fontWeight = FontWeight.Bold
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