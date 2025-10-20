package expo.modules.wakatimeglancewidgets.hours_widget

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import expo.modules.wakatimeglancewidgets.shared_utils.WidgetConstants

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = WidgetConstants.DATASTORE_NAME)