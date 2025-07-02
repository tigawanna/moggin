// package expo.modules.glancewidget

// import android.app.PendingIntent
// import android.appwidget.AppWidgetManager
// import android.content.ComponentName
// import android.content.Intent
// import android.os.Build
// import androidx.datastore.preferences.core.longPreferencesKey
// import androidx.datastore.preferences.core.stringPreferencesKey
// import androidx.glance.appwidget.GlanceAppWidgetManager
// import androidx.glance.appwidget.state.updateAppWidgetState
// import expo.modules.kotlin.modules.Module
// import expo.modules.kotlin.modules.ModuleDefinition
// import java.net.URL
// import kotlinx.coroutines.CoroutineScope
// import kotlinx.coroutines.Dispatchers
// import kotlinx.coroutines.launch

// class MyModule : Module() {

//     private val context
//         get() = requireNotNull(appContext.reactContext)

//     private val activity
//         get() = requireNotNull(appContext.activityProvider?.currentActivity)

//     // Each module class must implement the definition function. The definition consists of components
//     // that describe the module's functionality and behavior.
//     // See https://docs.expo.dev/modules/module-api/  for more details about available components.

//     override fun definition() = ModuleDefinition {
//         // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
//         // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
//         // The module will be accessible from `requireNativeModule('MyModule')` in JavaScript.
//         Name("MyModule")

//         // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
//         Constants(
//             "PI" to Math.PI
//         )

//         // Defines event names that the module can send to JavaScript.
//         Events("onChange")

//         // Enables the module to be used as a native view. Definition components that are accepted as part of
//         // the view definition: Prop, Events.
//         View(MyModuleView::class) {
//             // Defines a setter for the `url` prop.
//             Prop("url") { view: MyModuleView, url: URL ->
//                 view.webView.loadUrl(url.toString())
//             }

//             // Defines an event that the view can send to JavaScript.
//             Events("onLoad")
//         }

//         // Function to update the widget state
//         Function("updateWidget") { data: String ->
//             CoroutineScope(Dispatchers.IO).launch {
//                 val glanceIds =
//                     GlanceAppWidgetManager(activity).getGlanceIds(MyWidget::class.java)
//                 glanceIds.forEach { id ->
//                     updateAppWidgetState(activity, id) {
//                         it[stringPreferencesKey("now")] = data
//                     }
//                     MyWidget().update(activity, id)
//                 }
//             }
//         }
//     }
// }
