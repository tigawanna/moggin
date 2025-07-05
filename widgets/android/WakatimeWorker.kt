package com.anonymous.moggin

import android.content.Context
import android.os.Build
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import com.anonymous.moggin.wakatime.WakatimeSDK
import com.anonymous.moggin.utils.TimeUtils
import com.anonymous.moggin.utils.WakatimeDataFetcher
import androidx.glance.appwidget.GlanceAppWidgetManager

class WakatimeWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            Log.d("WakatimeWorker", "Starting periodic Wakatime sync")

            val result = WakatimeDataFetcher.fetchAndUpdateWidget(applicationContext)

            if (result.success) {
                Log.d("WakatimeWorker", "Successfully updated widget with: ${result.freshHours}")
                Result.success()
            } else {
                Log.e("WakatimeWorker", "Failed to update widget: ${result.error}")
                Result.retry()
            }

        } catch (e: Exception) {
            Log.e("WakatimeWorker", "Unhandled error in WakatimeWorker", e)
            Result.retry()
        }
}
}
