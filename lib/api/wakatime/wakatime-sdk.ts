import { settings$ } from "@/stores/use-app-settings";
import { computed } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { WakatimeLeaderboard } from "./types/leaderboard-types";
import { UserDailyDurations, WakatimeUser, WakatimeUserResponse } from "./types/current-user-types";

export class WakatimeSDK {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://wakatime.com";
  }

  private async fetchData<T = any>(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    params.api_key = this.apiKey;
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    // console.log("WakatimeSDK fetchData url: ===> ", url.toString());
    const response = await fetch(url.toString());
    if (!response.ok) {
      return {
        data: null,
        type: "error",
        error: `Error: ${response.status} ${response.statusText}`,
      };
    }
    const dataRes = (await response.json()) as T;
    // console.log("WakatimeSDK fetchData response: === ", dataRes);
    return {
      data: dataRes,
      type: "success",
      error: null,
    };
  }

  // Static method that doesn't need an instance
  static async checkIfTokenIsValid({ token }: { token: string }) {
    const baseUrl = "https://wakatime.com";
    if (!token || token.trim() === "") {
      return {
        isValid: false,
        error: "Token is required",
      };
    }
    const url = new URL(`${baseUrl}/api/v1/users/current`);
    url.searchParams.append("api_key", token);

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        return {
          isValid: false,
          error: `Error: ${response.status} ${response.statusText}`,
        };
      }

      const { data } = await response.json();
      return {
        isValid: true,
        data: data as WakatimeUser,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async getCurrentUser() {
    return this.fetchData<WakatimeUserResponse>("/api/v1/users/current");
  }

  async getUserStats(params: { start?: string; end?: string; project?: string }) {
    return this.fetchData("/api/v1/users/current/stats", params);
  }

  async getUserDurations(params: { date: string }) {
    return this.fetchData<UserDailyDurations>("/api/v1/users/current/durations", params);
  }

  // Leaderboard methods
  async getLeaderboard(params: { country?: string; page?: number; language?: string }) {
    return this.fetchData<WakatimeLeaderboard>("/api/v1/leaders", params);
  }

  async getUserHeartbeats(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/heartbeats", params);
  }
  async getUserProjects(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/projects", params);
  }
  async getUserLanguages(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/languages", params);
  }
  async getUserEditors(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/editors", params);
  }
  async getUserOperatingSystems(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/os", params);
  }
  async getUserMetrics(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/metrics", params);
  }
  async getUserProjectsStats(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/projects/stats", params);
  }
  async getUserLanguagesStats(params: { start?: string; end?: string }) {
    return this.fetchData("/api/v1/users/current/languages/stats", params);
  }

  async getCountryLeaderboard(params: { country: string; page?: number }) {
    return this.fetchData("/api/v1/leaders", params);
  }
}


export const wakatimeSDK$ = computed(() => {
  const apiKey = settings$.wakatimeApiKey.get();
  return apiKey ? new WakatimeSDK(apiKey) : null;
});

export function useWakatimeSDK() {
  const sdk = use$(() => wakatimeSDK$.get());
  return sdk;
}




