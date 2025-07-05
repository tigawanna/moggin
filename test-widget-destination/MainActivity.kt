package com.anonymous.bidii

import android.util.Log
import android.content.Context
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
import androidx.compose.ui.unit.dp
import com.anonymous.bidii.ui.theme.BidiiTheme
import androidx.compose.material3.Button
import androidx.compose.runtime.rememberCoroutineScope
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.launch
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.work.Constraints
import androidx.work.*
import java.util.concurrent.TimeUnit

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.compose.material3.OutlinedTextField
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth

import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.layout.heightIn
import androidx.compose.ui.text.font.FontWeight
import com.anonymous.bidii.wakatime.WakatimeDataFetcher
import com.anonymous.bidii.wakatime.WakatimeDataFetcher.updateWidget
import com.anonymous.bidii.wakatime.WakatimeWidgetWorker


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        // Initialize periodic work
        setupPeriodicWork()
        
        setContent {
            BidiiTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Current Widget Data Display (Top)
                        CurrentWidgetDataDisplay(context = applicationContext)
                        
                        // API Key Management Section (Middle)
                        ApiKeyManagement(context = applicationContext)
                        
                        // DataStore Keys Display (Bottom)
                        DataStoreKeysDisplay(context = applicationContext)
                        
                        // Manual Actions
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            SetTimeButton(context = applicationContext)
                            ManualSyncButton(context = applicationContext)
                        }
                    }
                }
            }
        }
    }
    
    private fun setupPeriodicWork() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val workRequest = PeriodicWorkRequestBuilder<WakatimeWidgetWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(applicationContext).enqueueUniquePeriodicWork(
            BidiiWidgetConstants.WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            workRequest
        )
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
fun ManualSyncButton(context: Context, modifier: Modifier = Modifier) {
    val scope = rememberCoroutineScope()

    Button(
        onClick = {
            scope.launch {
                // Trigger one-time work request for immediate sync
                val workRequest = OneTimeWorkRequestBuilder<WakatimeWidgetWorker>()
                    .setConstraints(
                        Constraints.Builder()
                            .setRequiredNetworkType(NetworkType.CONNECTED)
                            .build()
                    )
                    .build()

                WorkManager.getInstance(context).enqueue(workRequest)
                Log.d("MainActivity", "Manual sync triggered")
            }
        },
        modifier = modifier
    ) {
        Text(text = "Sync Now")
    }
}

@Composable
fun CurrentWidgetDataDisplay(context: Context) {
    val scope = rememberCoroutineScope()
    var currentData by remember { mutableStateOf("Loading...") }
    var totalTime by remember { mutableStateOf("00 hrs : 00 mins") }
    var currentProject by remember { mutableStateOf("No project") }
    var lastSync by remember { mutableStateOf("Never") }
    var isRefreshing by remember { mutableStateOf(false) }
    
    val refreshData = {
        scope.launch {
            isRefreshing = true
            try {
                val result = WakatimeDataFetcher.fetchWakatimeData(context)
                currentData = if (result.success && result.freshHours != null) {
                    "Fresh Data: ${result.freshHours}"
                } else if (result.error != null) {
                    "Widget: ${result.widgetHours} | Error: ${result.error}"
                } else {
                    "Widget: ${result.widgetHours} | No fresh data"
                }
                
                // Update individual data fields
                totalTime = result.totalTime ?: "00 hrs : 00 mins"
                currentProject = result.currentProject ?: "No project"
                lastSync = result.lastSync ?: "Never"
                
            } catch (e: Exception) {
                currentData = "Error: ${e.message}"
            } finally {
                isRefreshing = false
            }
        }
    }
    
    val refreshAndUpdateWidget = {
        scope.launch {
            isRefreshing = true
            try {
                val result = WakatimeDataFetcher.fetchAndUpdateWidget(context)
                currentData = if (result.success && result.freshHours != null) {
                    "Updated! Total: ${result.totalTime}"
                } else if (result.error != null) {
                    "Widget: ${result.widgetHours} | Error: ${result.error}"
                } else {
                    "Widget: ${result.widgetHours} | Update failed"
                }
                
                // Update individual data fields
                totalTime = result.totalTime ?: "00 hrs : 00 mins"
                currentProject = result.currentProject ?: "No project"
                lastSync = result.lastSync ?: "Never"

            } catch (e: Exception) {
                currentData = "Error: ${e.message}"
            } finally {
                isRefreshing = false
            }
        }
    }
    
    LaunchedEffect(Unit) {
        refreshData()
    }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "Current Wakatime Data",
            style = androidx.compose.material3.MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        // Display aggregated data
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = totalTime,
                style = androidx.compose.material3.MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            Text(
                text = "📁 $currentProject",
                style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(bottom = 4.dp)
            )
            
            Text(
                text = "🔄 $lastSync",
                style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            Text(
                text = currentData,
                style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(8.dp)
            )
        }
        
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = { refreshData() },
                enabled = !isRefreshing
            ) {
                Text(if (isRefreshing) "Loading..." else "Refresh Data")
            }
            
            Button(
                onClick = { refreshAndUpdateWidget() },
                enabled = !isRefreshing
            ) {
                Text(if (isRefreshing) "Updating..." else "Update Widget")
            }
        }
    }
}

@Composable
fun ApiKeyManagement(context: Context) {
    var apiKey by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "Wakatime API Key",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = apiKey,
                onValueChange = { apiKey = it },
                label = { Text("API Key") },
                placeholder = { Text("waka_...") },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.weight(1f),
                singleLine = true
            )
            
            Button(
                onClick = {
                    scope.launch {
                        context.dataStore.edit { preferences ->
                            preferences[BidiiWidgetConstants.WAKATIME_API_KEY] = apiKey
                        }
                        apiKey = "" // Clear input after saving
                    }
                },
                enabled = apiKey.isNotBlank()
            ) {
                Text("Save")
            }
        }
    }
}

@Composable
fun DataStoreKeysDisplay(context: Context) {
    val scope = rememberCoroutineScope()
    var dataStoreEntries by remember { mutableStateOf<List<Pair<String, String>>>(emptyList()) }
    
    LaunchedEffect(Unit) {
        scope.launch {
            try {
                context.dataStore.data.collect { preferences ->
                    dataStoreEntries = preferences.asMap().map { (key, value) ->
                        key.name to value.toString()
                    }
                }
            } catch (e: Exception) {
                Log.e("DataStoreKeysDisplay", "Error reading DataStore", e)
            }
        }
    }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = "DataStore Contents",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        
        if (dataStoreEntries.isEmpty()) {
            Text(
                text = "No data stored yet",
                style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant
            )
        } else {
            LazyColumn(
                modifier = Modifier.heightIn(max = 200.dp)
            ) {
                items(dataStoreEntries) { (key, value) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = key,
                            style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                            modifier = Modifier.weight(1f)
                        )
                        Text(
                            text = if (key.contains("api_key")) "***" else value,
                            style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
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
