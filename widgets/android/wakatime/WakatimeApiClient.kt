package com.tigawanna.moggin.wakatime

import android.util.Log
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class WakatimeApiClient(private val apiKey: String) {
    
    private val httpClient = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                coerceInputValues = true
            })
        }
        
        install(Logging) {
            logger = object : Logger {
                override fun log(message: String) {
                    Log.d("WakatimeApiClient", message)
                }
            }
            level = LogLevel.INFO
        }
    }
    
    suspend fun getDurations(date: String): Result<DurationResponse> {
        return try {
            val response: HttpResponse = httpClient.get("https://wakatime.com/api/v1/users/current/durations") {
                url {
                    parameters.append("date", date)
                    parameters.append("api_key", apiKey)
                }
            }
            
            if (response.status.value in 200..299) {
                val jsonString = response.bodyAsText()
                val durationResponse = Json.decodeFromString<DurationResponse>(jsonString)
                Result.success(durationResponse)
            } else {
                val errorBody = response.bodyAsText()
                Log.e("WakatimeApiClient", "HTTP ${response.status.value}: $errorBody")
                Result.failure(Exception("HTTP ${response.status.value}: $errorBody"))
            }
        } catch (e: Exception) {
            Log.e("WakatimeApiClient", "Error making API request", e)
            Result.failure(e)
        }
    }
    
    fun close() {
        httpClient.close()
    }
}
