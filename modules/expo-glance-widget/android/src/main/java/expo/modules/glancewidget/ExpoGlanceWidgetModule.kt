package expo.modules.glancewidget

import android.app.PendingIntent
import android.appWidget.AppWidgetManager
import android.content.ComponentName
import android.os.Build
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ExpoGlanceWidgetModule : Module() {
    private val context
        get() = requireNotNull(appContext.reactContext)
        
    private val activity
        get() = requireNotNull(appContext.activityProvider?.currentActivity)

    override fun definition() = ModuleDefinition {
        name("ExpoGlanceWidgetModule")

        view(ExpoGlanceWidgetModuleView::class) {
            prop("url") { view: ExpoGlanceWidgetModuleView, url: URL ->
                view.webView.loadUrl(url.toString())
            }
            events("onLoad")
        }

        

        function("createWidget") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val appWidgetManager = AppWidgetManager.getInstance(activity)
                val provider = ComponentName(activity, MyAppWidgetReceiver::class.java)
                if (appWidgetManager.isRequestPinAppWidgetSupported) {
                    val launchIntent = activity.packageManager.getLaunchIntentForPackage(activity.packageName)
                    val successCallback = launchIntent?.let {
                        PendingIntent.getBroadcast(
                            activity, 0, it,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
                        )
                    }
                    appWidgetManager.requestPinAppWidget(provider, null, successCallback)
                }
            }
        }

        function("updateWakatimeHours") { hours: String ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    // Use DataStoreHelper to set the value
                    val context = context
                    val dataStore = com.anonymous.moggin.DataStoreHelper.create(context)
                    dataStore.setString("wakatime_hours", hours)

                    // Update all widgets
                    val manager = GlanceAppWidgetManager(context)
                    val glanceIds = manager.getGlanceIds(com.anonymous.moggin.BidiiHoursWidget::class.java)
                    glanceIds.forEach { id ->
                        com.anonymous.moggin.BidiiHoursWidget().update(context, id)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
}
