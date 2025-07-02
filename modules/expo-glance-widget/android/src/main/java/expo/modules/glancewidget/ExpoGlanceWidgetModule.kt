package expo.modules.glancewidget

import android.content.Context
import android.util.Log
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.*
import kotlin.reflect.KClass

/**
 * Record class for DataStore options
 */
class DataStoreOptions : Record {
  @Field
  val name: String? = null
}

/**
 * ExpoGlanceWidget Module
 * Provides DataStore API for Expo apps to store data and update Glance widgets
 */
class ExpoGlanceWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    // Module name
    Name("ExpoGlanceWidget")
    
  }
}
