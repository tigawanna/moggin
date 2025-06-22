package com.anonymous.moggin


import android.content.ComponentName
import android.content.Context

import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.action.actionStartActivity // Import this
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


class BidiiHoursWidget : GlanceAppWidget() {
    val bidiiWakatimeHoursKey = stringPreferencesKey("wakatime_hours")

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val bidiiWakatimeHours = currentState(key = bidiiWakatimeHoursKey) ?: "--:--"

            // Create an action to open your app using ComponentName
            val componentName = ComponentName(context, MainActivity::class.java)
            val launchAppAction = actionStartActivity(componentName)

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
                            .clickable(launchAppAction)
                            ,
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
//                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        Text(
                            text = bidiiWakatimeHours,
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


class BidiiHoursWidgetReceiver: GlanceAppWidgetReceiver(){
    override val glanceAppWidget: GlanceAppWidget = BidiiHoursWidget()
}