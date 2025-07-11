package com.yourapp.widgets

import android.content.Context
import androidx.compose.runtime.*
import androidx.compose.ui.unit.dp
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.glance.GlanceId
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.flow.first
import java.text.SimpleDateFormat
import java.util.*

/**
 * Example widget that demonstrates how to use the DataStore with Expo
 * This widget reads values that were set from the Expo/React Native side
 */

// Use the same DataStore name as your existing configuration
object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_preferences"
}

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)

class ExampleWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Read values from DataStore
        val preferences = context.dataStore.data.first()
        val userName = preferences[stringPreferencesKey("user_name")] ?: "Unknown User"
        val lastUpdate = preferences[stringPreferencesKey("last_update")] ?: "Never"
        val counter = preferences[stringPreferencesKey("counter")] ?: "0"
        val status = preferences[stringPreferencesKey("status")] ?: "Offline"
        
        provideContent {
            Column(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(ColorProvider(android.graphics.Color.WHITE))
                    .padding(16.dp)
            ) {
                // Title
                Text(
                    text = "My Widget",
                    style = TextStyle(
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                
                Spacer(modifier = GlanceModifier.height(8.dp))
                
                // User information
                Text(
                    text = "User: $userName",
                    style = TextStyle(fontSize = 14.sp)
                )
                
                Text(
                    text = "Status: $status",
                    style = TextStyle(fontSize = 14.sp)
                )
                
                Text(
                    text = "Counter: $counter",
                    style = TextStyle(fontSize = 14.sp)
                )
                
                Spacer(modifier = GlanceModifier.height(4.dp))
                
                // Last update time
                Text(
                    text = "Last Update: ${formatDate(lastUpdate)}",
                    style = TextStyle(
                        fontSize = 12.sp,
                        color = ColorProvider(android.graphics.Color.GRAY)
                    )
                )
                
                // Current time
                Text(
                    text = "Widget Updated: ${getCurrentTime()}",
                    style = TextStyle(
                        fontSize = 12.sp,
                        color = ColorProvider(android.graphics.Color.GRAY)
                    )
                )
            }
        }
    }
    
    private fun formatDate(dateString: String): String {
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd, HH:mm", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            dateString
        }
    }
    
    private fun getCurrentTime(): String {
        return SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
    }
}

class ExampleWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = ExampleWidget()
}
