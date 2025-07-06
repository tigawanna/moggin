import { settings$ } from "@/stores/use-app-settings";
import { computed } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";

export class WakatimeSDK {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://wakatime.com";
  }

  private async fetchData(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    params.api_key = this.apiKey;
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const response = await fetch(url.toString());
    if (!response.ok) {
      return {
        data: null,
        error: `Error: ${response.status} ${response.statusText}`,
      };
    }
    const { data } = await response.json();
    return {
      data,
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
    return this.fetchData("/api/v1/users/current");
  }
  async getUserStats(params: { start?: string; end?: string; project?: string }) {
    return this.fetchData("/api/v1/users/current/stats", params);
  }

  async getUserDurations(params: { date: string }) {
    return this.fetchData("/api/v1/users/current/durations", params);
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
}


export const wakatimeSDK$ = computed(() => {
  const apiKey = settings$.wakatimeApiKey.get();
  return apiKey ? new WakatimeSDK(apiKey) : null;
});

export function useWakatimeSDK() {
  const sdk = use$(() => wakatimeSDK$.get());
  return sdk;
}


export type WakatimeUser = {
  bio: any;
  categories_used_public: boolean;
  city: any;
  color_scheme: string;
  created_at: string;
  date_format: string;
  default_dashboard_range: string;
  display_name: string;
  durations_slice_by: string;
  editors_used_public: boolean;
  email: string;
  full_name: any;
  github_username: any;
  has_basic_features: boolean;
  has_premium_features: boolean;
  human_readable_website: any;
  id: string;
  invoice_counter: number;
  invoice_id_format: string;
  is_email_confirmed: boolean;
  is_email_public: boolean;
  is_hireable: boolean;
  is_onboarding_finished: boolean;
  languages_used_public: boolean;
  last_branch: string;
  last_heartbeat_at: string;
  last_language: string;
  last_plugin: string;
  last_plugin_name: string;
  last_project: string;
  linkedin_username: any;
  location: any;
  logged_time_public: boolean;
  modified_at: string;
  needs_payment_method: boolean;
  os_used_public: boolean;
  photo: string;
  photo_public: boolean;
  plan: string;
  profile_url: string;
  profile_url_escaped: string;
  public_email: any;
  public_profile_time_range: string;
  share_all_time_badge: any;
  share_last_year_days: any;
  show_machine_name_ip: boolean;
  suggest_dangling_branches: boolean;
  time_format_24hr: any;
  time_format_display: string;
  timeout: number;
  timezone: string;
  twitter_username: any;
  username: any;
  website: any;
  weekday_start: number;
  wonderfuldev_username: any;
  writes_only: boolean;
};
export type WakatimeUserResponse = {
  data: WakatimeUser | null;
  status: string;
  error?: string | null;
};
