package com.tigawanna.moggin.wakatime

import android.util.Log

class WakatimeSDK(private val apiKey: String) {
    private val apiClient = WakatimeApiClient(apiKey)

    /**
     * Fetches durations for the current user for a specific date and calculates total hours.
     *
     * @param date The date for which to fetch durations, in "YYYY-MM-DD" format.
     * @return SdkResponse containing the DurationResponse and total hours, or an error message.
     */
    suspend fun getDurationsForDate(date: String): SdkResponse<DurationResponse> {
        return try {
            Log.d("WakatimeSDK", "Fetching durations for date: $date")
            
            val result = apiClient.getDurations(date)
            
            if (result.isSuccess) {
                val response = result.getOrNull()!!
                
                // Calculate total duration in hours
                val totalSeconds = response.data.sumOf { it.durationInSeconds }
                val totalHours = totalSeconds / 3600.0

                Log.d("WakatimeSDK", "Successfully fetched durations. Total hours: $totalHours")
                SdkResponse(data = response, totalHours = totalHours)
            } else {
                val exception = result.exceptionOrNull()
                val errorMessage = exception?.message ?: "Unknown error"
                Log.e("WakatimeSDK", "Error fetching durations: $errorMessage", exception)
                SdkResponse(error = errorMessage)
            }
        } catch (e: Exception) {
            Log.e("WakatimeSDK", "Unexpected error in getDurationsForDate", e)
            SdkResponse(error = "Unexpected error: ${e.message}")
        }
    }
    
    /**
     * Clean up resources
     */
    fun close() {
        apiClient.close()
    }
}
