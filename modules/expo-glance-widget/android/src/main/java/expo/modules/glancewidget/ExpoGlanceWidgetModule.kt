package expo.modules.glancewidget

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.net.URL

// Record class for SharedPreferences options
class SharedPreferencesOptions : Record {
  @Field
  val name: String? = null
}

class ExpoGlanceWidgetModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoGlanceWidget')` in JavaScript.
    Name("ExpoGlanceWidget")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Shared Preferences functions
    AsyncFunction("setSharedPreferenceAsync") { key: String, value: Any?, options: SharedPreferencesOptions? ->
      val prefs = getSharedPreferences(options)
      val editor = prefs.edit()
      
      when (value) {
        is String -> editor.putString(key, value)
        is Int -> editor.putInt(key, value)
        is Long -> editor.putLong(key, value)
        is Float -> editor.putFloat(key, value)
        is Double -> editor.putFloat(key, value.toFloat()) // SharedPreferences doesn't support Double, convert to Float
        is Boolean -> editor.putBoolean(key, value)
        null -> editor.remove(key)
        else -> throw IllegalArgumentException("Unsupported value type: ${value::class.java.simpleName}")
      }
      
      editor.apply()
    }

    AsyncFunction("getSharedPreferenceAsync") { key: String, options: SharedPreferencesOptions? ->
      val prefs = getSharedPreferences(options)
      val allPrefs = prefs.all
      allPrefs[key]
    }

    AsyncFunction("removeSharedPreferenceAsync") { key: String, options: SharedPreferencesOptions? ->
      val prefs = getSharedPreferences(options)
      val editor = prefs.edit()
      editor.remove(key)
      editor.apply()
    }

    AsyncFunction("clearSharedPreferencesAsync") { options: SharedPreferencesOptions? ->
      val prefs = getSharedPreferences(options)
      val editor = prefs.edit()
      editor.clear()
      editor.apply()
    }

    AsyncFunction("getAllSharedPreferencesAsync") { options: SharedPreferencesOptions? ->
      val prefs = getSharedPreferences(options)
      prefs.all
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoGlanceWidgetView::class) {
      // Defines a setter for the `url` prop.
      Prop("url") { view: ExpoGlanceWidgetView, url: URL ->
        view.webView.loadUrl(url.toString())
      }
      // Defines an event that the view can send to JavaScript.
      Events("onLoad")
    }
  }

  private fun getSharedPreferences(options: SharedPreferencesOptions?): SharedPreferences {
    val context = appContext.reactContext ?: throw IllegalStateException("React context is not available")
    val preferencesName = options?.name ?: context.packageName
    return context.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)
  }
}
