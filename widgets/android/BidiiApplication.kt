package com.anonymous.moggin

import android.app.Application
import android.util.Log
import androidx.work.Configuration
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class BidiiApplication : Application(), Configuration.Provider {

    /**
     * Provides the custom configuration for WorkManager.
     * WorkManager will use this configuration when it initializes on-demand.
     */
    override val workManagerConfiguration: Configuration
        get() = Configuration.Builder()
            .setMinimumLoggingLevel(android.util.Log.INFO)
            .build()

    override fun onCreate() {
        super.onCreate()
        
        Log.d("BidiiApplication", "Application onCreate: Custom WorkManager configuration is available.")
        
        // Set up periodic work to fetch Wakatime data
        setupPeriodicWakatimeSync()
    }
    
    private fun setupPeriodicWakatimeSync() {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .setRequiresBatteryNotLow(true)
            .build()

        // Android enforces a minimum interval of 15 minutes for PeriodicWorkRequest
        val workRequest = PeriodicWorkRequestBuilder<WakatimeWorker>(
            BidiiWidgetConstants.SYNC_INTERVAL_MINUTES, 
            TimeUnit.MINUTES
        )
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            BidiiWidgetConstants.WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            workRequest
        )
        
        Log.d("BidiiApplication", "Periodic Wakatime sync work scheduled for every 15 minutes")
    }
}
