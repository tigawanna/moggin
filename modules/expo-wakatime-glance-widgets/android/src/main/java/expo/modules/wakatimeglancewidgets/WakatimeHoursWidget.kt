package expo.modules.wakatimeglancewidgets

import android.content.Context
import android.content.Intent
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.ImageProvider
import androidx.glance.Image
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.components.Scaffold
import androidx.glance.appwidget.components.TitleBar
import androidx.glance.appwidget.provideContent
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.state.GlanceStateDefinition
import androidx.glance.state.PreferencesGlanceStateDefinition
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.LocalSize
import androidx.glance.appwidget.SizeMode
import androidx.compose.ui.unit.DpSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.datastore.core.DataStore
import androidx.glance.action.clickable
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.layout.padding
import androidx.glance.layout.Spacer
import androidx.glance.layout.height

class LaunchMainActivityAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        try {
            // Option 1: Launch by package name (most reliable)
            val packageManager = context.packageManager
            val intent = packageManager.getLaunchIntentForPackage(context.packageName)
            intent?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP or
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback: Try to launch any activity from the app
            try {
                val intent = Intent().apply {
                    setPackage(context.packageName)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                            Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                context.startActivity(intent)
            } catch (fallbackException: Exception) {
                // If all else fails, open the app info page
                val settingsIntent = Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                    data = android.net.Uri.fromParts("package", context.packageName, null)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(settingsIntent)
            }
        }
    }
}

// Alternative: Deep link approach
class LaunchAppWithDeepLinkAction : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        try {
            // Launch using the app's custom scheme (from app.config.ts: scheme: "moggin")
            val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse("moggin://")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP or
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback to package launch
            val packageManager = context.packageManager
            val fallbackIntent = packageManager.getLaunchIntentForPackage(context.packageName)
            fallbackIntent?.apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP or
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
            }
            context.startActivity(fallbackIntent)
        }
    }
}

class WakatimeHoursWidget : GlanceAppWidget() {
    override var stateDefinition: GlanceStateDefinition<*> = PreferencesGlanceStateDefinition

    companion object {
        // Predefined sizes for responsive layout
        private val SMALL_SQUARE = DpSize(150.dp, 90.dp)
        private val HORIZONTAL_RECTANGLE = DpSize(200.dp, 90.dp)
        private val BIG_SQUARE = DpSize(250.dp, 180.dp)

        // Size-based styling
        fun getTimeTextSize(size: DpSize): androidx.compose.ui.unit.TextUnit {
            return when {
                size.width >= BIG_SQUARE.width -> 32.sp
                size.width >= HORIZONTAL_RECTANGLE.width -> 26.sp
                else -> 22.sp
            }
        }

        fun getDescriptorTextSize(size: DpSize): androidx.compose.ui.unit.TextUnit {
            return when {
                size.width >= BIG_SQUARE.width -> 12.sp
                size.width >= HORIZONTAL_RECTANGLE.width -> 10.sp
                else -> 8.sp
            }
        }

        private fun getResponsiveModifiers(size: DpSize): GlanceModifier {
            val isWide = size.width >= HORIZONTAL_RECTANGLE.width

            return GlanceModifier.then(
                if (isWide) {
                    // Wide layout modifiers
                    GlanceModifier.padding(horizontal = 8.dp)
                } else {
                    // Narrow layout modifiers
                    GlanceModifier.padding(horizontal = 4.dp)
                }
            )
        }
    }

    override val sizeMode = SizeMode.Responsive(
        setOf(
            SMALL_SQUARE,
            HORIZONTAL_RECTANGLE,
            BIG_SQUARE
        )
    )

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val prefs = currentState<Preferences>()
            val size = LocalSize.current

            val totalTime = prefs[WidgetConstants.WAKATIME_TOTAL_TIME_KEY]
                ?: "-- hrs : -- mins"

            val currentProject = prefs[WidgetConstants.WAKATIME_CURRENT_PROJECT_KEY]
                ?: "----"

            val lastSync = prefs[WidgetConstants.WAKATIME_LAST_SYNC_KEY]
                ?: "--:--"

            val launchAppAction = actionRunCallback<LaunchMainActivityAction>()

            // Calculate responsive sizes based on predefined sizes
            val timeTextSize = getTimeTextSize(size)
            val descriptorTextSize = getDescriptorTextSize(size)
            val isWideWidget = size.width >= BIG_SQUARE.width
            val responsiveModifiers = getResponsiveModifiers(size)

            GlanceTheme {
                Scaffold(
                    titleBar = {
                        TitleBar(
                            startIcon = ImageProvider(R.drawable.widget_icon),
                            title = "Wakatime",
                        )
                    },
                    backgroundColor = GlanceTheme.colors.widgetBackground
                ) {
                    WidgetContent(
                        totalTime = totalTime,
                        currentProject = currentProject,
                        lastSync = lastSync,
                        timeTextSize = timeTextSize,
                        descriptorTextSize = descriptorTextSize,
                        isWideWidget = isWideWidget,
                        responsiveModifiers = responsiveModifiers,
                        launchAppAction = launchAppAction
                    )
                }
            }
        }
    }

    @Composable
    private fun WidgetContent(
        totalTime: String,
        currentProject: String,
        lastSync: String,
        timeTextSize: androidx.compose.ui.unit.TextUnit,
        descriptorTextSize: androidx.compose.ui.unit.TextUnit,
        isWideWidget: Boolean,
        responsiveModifiers: GlanceModifier,
        launchAppAction: androidx.glance.action.Action
    ) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .clickable(launchAppAction)
                .padding(8.dp)
                .then(responsiveModifiers),
            horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
            verticalAlignment = Alignment.Vertical.Top
        ) {
            // Main hours display with responsive size
            if (isWideWidget) {
                Text(
                    text = totalTime,
                    style = TextStyle(
                        fontSize = timeTextSize,
                        color = GlanceTheme.colors.onSurface,
                        fontWeight = FontWeight.Bold
                    )
                )
            } else {
                val hours = totalTime.split(":")[0]
                val minutes = totalTime.split(":")[1]

                Column(
                    modifier = GlanceModifier
                        .padding(horizontal = 4.dp),
                    horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                    verticalAlignment = Alignment.Vertical.CenterVertically
                ) {
                    Text(
                        text = hours,
                        style = TextStyle(
                            fontSize = timeTextSize,
                            color = GlanceTheme.colors.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = minutes,
                        style = TextStyle(
                            fontSize = timeTextSize,
                            color = GlanceTheme.colors.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Spacer(modifier = GlanceModifier.height(4.dp))
            Column(
                horizontalAlignment = Alignment.Horizontal.CenterHorizontally
            ) {
                // Last project
                Text(
                    text = "Last project: $currentProject",
                    style = TextStyle(
                        fontSize = descriptorTextSize,
                        color = GlanceTheme.colors.onSurfaceVariant
                    )
                )

                Spacer(modifier = GlanceModifier.height(2.dp))

                // Last refreshed
                Text(
                    text = "Last refreshed: $lastSync",
                    style = TextStyle(
                        fontSize = descriptorTextSize,
                        color = GlanceTheme.colors.onSurfaceVariant
                    )
                )
            }
        }
    }
}

class WakatimeHoursWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = WakatimeHoursWidget()
}
