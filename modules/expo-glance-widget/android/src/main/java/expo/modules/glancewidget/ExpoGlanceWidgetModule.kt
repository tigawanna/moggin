package expo.modules.glancewidget

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.*
import java.net.URL

// Record class for SharedPreferences options
class SharedPreferencesOptions : Record {
  @Field
  val name: String? = null
}

// Record class for DataStore options
class DataStoreOptions : Record {
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

    // DataStore functions
    AsyncFunction("setDataStoreAsync") { key: String, value: Any?, options: DataStoreOptions? ->
      val dataStore = getDataStore(options)
      
      when (value) {
        is String -> runBlocking { dataStore.setString(key, value) }
        is Int -> runBlocking { dataStore.setInt(key, value) }
        is Long -> runBlocking { dataStore.setLong(key, value) }
        is Float -> runBlocking { dataStore.setFloat(key, value) }
        is Double -> runBlocking { dataStore.setFloat(key, value.toFloat()) } // Convert Double to Float
        is Boolean -> runBlocking { dataStore.setBoolean(key, value) }
        null -> runBlocking { dataStore.remove(key) }
        else -> throw IllegalArgumentException("Unsupported value type: ${value::class.java.simpleName}")
      }
    }

    AsyncFunction("getDataStoreAsync") { key: String, options: DataStoreOptions? ->
      val dataStore = getDataStore(options)
      runBlocking {
        val allData = dataStore.getAll()
        allData[key]
      }
    }

    AsyncFunction("removeDataStoreAsync") { key: String, options: DataStoreOptions? ->
      val dataStore = getDataStore(options)
      runBlocking { dataStore.remove(key) }
    }

    AsyncFunction("clearDataStoreAsync") { options: DataStoreOptions? ->
      val dataStore = getDataStore(options)
      runBlocking { dataStore.clear() }
    }

    AsyncFunction("getAllDataStoreAsync") { options: DataStoreOptions? ->
      val dataStore = getDataStore(options)
      runBlocking { dataStore.getAll() }
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

  private fun getDataStore(options: DataStoreOptions?): DataStoreWrapper {
    val context = appContext.reactContext ?: throw IllegalStateException("React context is not available")
    val dataStoreName = options?.name ?: "${context.packageName}_preferences"
    return DataStoreHelper.create(context, dataStoreName)
  }
}
