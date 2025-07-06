package com.tigawanna.moggin.wakatime

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class WakatimeWidgetWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            Log.d("WakatimeWidgetWorker", "Starting periodic Wakatime sync")

            val result = WakatimeDataFetcher.fetchAndUpdateWidget(applicationContext)

            if (result.success) {
                Log.d("WakatimeWidgetWorker", "Successfully updated widget with: ${result.freshHours}")
                Result.success()
            } else {
                Log.e("WakatimeWidgetWorker", "Failed to update widget: ${result.error}")
                Result.retry()
            }

        } catch (e: Exception) {
            Log.e("WakatimeWidgetWorker", "Unhandled error in WakatimeWidgetWorker", e)
            Result.retry()
        }
}
}
