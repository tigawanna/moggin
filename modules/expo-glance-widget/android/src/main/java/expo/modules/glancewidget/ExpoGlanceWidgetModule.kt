package expo.modules.glancewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.os.Build
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch



class ExpoGlanceWidgetModule : Module() {
    private val context
        get() = requireNotNull(appContext.reactContext)
        
    private val activity
        get() = requireNotNull(appContext.activityProvider?.currentActivity)

    override fun definition() = ModuleDefinition {
        Name("ExpoGlanceWidgetModule")

        Constants(
            "PI" to Math.PI
        )

        Events("onChange")

        // Function("createWidget") {
        //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //         val appWidgetManager = AppWidgetManager.getInstance(activity)
        //         val provider = ComponentName(activity,BidiiHoursWidgetReceiver::class.java)
        //         if (appWidgetManager.isRequestPinAppWidgetSupported) {
        //             val launchIntent = activity.packageManager.getLaunchIntentForPackage(activity.packageName)
        //             val successCallback = launchIntent?.let {
        //                 PendingIntent.getBroadcast(
        //                     activity, 0, it,
        //                     PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        //                 )
        //             }
        //             appWidgetManager.requestPinAppWidget(provider, null, successCallback)
        //         }
        //     }
        // }

        // Function("updateWidget") { data: String ->
        //     val activity = activity
        //     CoroutineScope(Dispatchers.IO).launch {
        //         try{
        //         val glanceIds =
        //             GlanceAppWidgetManager(activity).getGlanceIds(com.anonymous.moggin.BidiiHoursWidget::class.java)
        //         glanceIds.forEach { id ->
        //             updateAppWidgetState(activity, id) {
        //                 it[stringPreferencesKey("now")] = data
        //             }
        //             com.anonymous.moggin.BidiiHoursWidget().update(activity, id)
        //         }

        //         } catch (e: Exception) {
        //             e.printStackTrace()
        //         }
        //     }
        // }
    }
}
