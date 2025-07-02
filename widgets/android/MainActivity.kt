package com.anonymous.moggin

import android.util.Log
import android.content.ComponentName
import android.content.Context
import android.appwidget.AppWidgetManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.anonymous.moggin.ui.theme.BidiiTheme
import androidx.compose.material3.Button
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.platform.LocalContext
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import kotlinx.coroutines.flow.map

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.updateAll

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BidiiTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    val wakatimeHoursFlow = applicationContext.dataStore.data.map { preferences ->
                        preferences[BidiiWidgetConstants.WAKATIME_HOURS_KEY] ?: BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY
                    }
                    val wakatimeHours by wakatimeHoursFlow.collectAsState(initial = BidiiWidgetConstants.DEFAULT_HOURS_DISPLAY)

                    Column(
                        modifier = Modifier.fillMaxSize().padding(innerPadding),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Widget should display: $wakatimeHours",
                            modifier = Modifier.padding(bottom = 16.dp)
                        )
                        SetTimeButton(context = applicationContext)
                    }
                }
            }
        }
    }
}

private suspend fun updateWidget(context: Context, data: String) {
    if (data.isBlank()) {
        Log.w("MainActivity", "Invalid data for widget update")
        return
    }

    // Use IO dispatcher for DataStore and other background tasks
    withContext(Dispatchers.IO) {
        try {
            // 1. Update application state (DataStore)
            context.dataStore.edit { settings ->
                settings[BidiiWidgetConstants.WAKATIME_HOURS_KEY] = data
            }

            // 2. Update all instances of the widget.
            // The updateAll() method is a convenient and efficient way to refresh all
            // placed instances of a widget.
            Log.d("MainActivity", "Updating all BidiiHoursWidget instances.")
            BidiiHoursWidget().updateAll(context)

        } catch (e: Exception) {
            // Log any errors during the update process
            Log.e("MainActivity", "Failed to update widget", e)
        }
    }
}

@Composable
fun SetTimeButton(context: Context, modifier: Modifier = Modifier) {
    val scope = rememberCoroutineScope()
    val hours = "09:00"

    Button(
        onClick = {
            scope.launch {
                updateWidget(context, hours)
            }
        },
        modifier = modifier
    ) {
        Text(text = "Set Time to $hours")
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
            .fillMaxSize()
            .padding(56.dp)
    )
}

//@Preview(showBackground = true)
//@Composable
//fun GreetingPreview() {
//    BidiiTheme {
//        Greeting("Android")
//    }
//}

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)
