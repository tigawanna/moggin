package com.tigawanna.moggin.wakatime

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class DurationResponse(
    @SerialName("data") val data: List<DurationEntry>,
    @SerialName("end") val end: String,
    @SerialName("start") val start: String,
    @SerialName("timezone") val timezone: String
)

@Serializable
data class DurationEntry(
    @SerialName("color") val color: String? = null,
    @SerialName("duration") val durationInSeconds: Double,
    @SerialName("project") val project: String,
    @SerialName("time") val time: Double
)

// Wrapper class for the SDK result
data class SdkResponse<T>(
    val data: T? = null,
    val error: String? = null,
    val totalHours: Double? = null
)
