package expo.modules.wakatimeglancewidgets.hours_widget

import android.content.Context
import android.util.Log
import androidx.work.*
import expo.modules.wakatimeglancewidgets.shared_utils.WidgetConstants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

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
    
    companion object {
        fun setupPeriodicWork(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val workRequest = PeriodicWorkRequestBuilder<WakatimeWidgetWorker>(15, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WidgetConstants.WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                workRequest
            )
        }
    }
}
