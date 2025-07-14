package expo.modules.wakatimeglancewidgets.shared_utils

import java.util.Locale

object TimeUtils {
    fun formatHours(totalHours: Double): String {
        return when {
            totalHours < 0.1 -> "0.0 h"
            totalHours < 1.0 -> String.format(Locale.US, "%.1f h", totalHours)
            totalHours >= 100.0 -> String.format(Locale.US, "%.0f h", totalHours)
            else -> String.format(Locale.US, "%.1f h", totalHours)
        }
    }
    
    fun formatHoursAndMinutes(totalHours: Double): String {
        val hours = totalHours.toInt()
        val minutes = ((totalHours - hours) * 60).toInt()
        
        return when {
            hours == 0 && minutes == 0 -> "0m"
            hours == 0 -> "${minutes}m"
            minutes == 0 -> "${hours}h"
            else -> "${hours}h ${minutes}m"
        }
    }
}
