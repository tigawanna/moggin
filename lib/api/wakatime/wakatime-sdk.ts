import { UserDailyDurations, WakatimeUser, WakatimeUserResponse } from "./types/current-user-types";
import { WakatimeLeaderboard } from "./types/leaderboard-types";

const baseUrl = "https://wakatime.com" as const;

export async function fetchData<T = any>(
  endpoint: string,
  params: Record<string, any> & { api_key: string | null } = { api_key: null }
) {
  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorMessage = await response
      .json()
      .then((data) => (data.error as string) || `Error: ${response.status} ${response.statusText}`)
      .catch(() => "Failed to parse error message");
    console.log("Wakatime fetchData error:", response.status, errorMessage);
    if (response.status === 401 || response.status === 403) {
      return {
        data: null,
        type: "unauthorized",
        status: response.status,
        error: errorMessage,
      } as const;
    }
    if (response.status === 429) {
      return {
        data: null,
        type: "rate_limit_exceeded",
        status: response.status,
        error: errorMessage,
      } as const;
    }

    return {
      data: null,
      type: "error",
      status: response.status,
      error: errorMessage,
    } as const;
  }
  const dataRes = (await response.json()) as T;
  return {
    data: dataRes,
    status: response.status,
    type: "success",
    error: null,
  } as const;
}

// Simple fetch function to avoid circular dependency with WakatimeSDK
export async function fetchCurrentUser(api_key: string) {
  const url = new URL("https://wakatime.com/api/v1/users/current");
  url.searchParams.append("api_key", api_key);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorMessage = await response
      .json()
      .then((data) => (data.error as string) || `Error: ${response.status} ${response.statusText}`)
      .catch(() => "Failed to parse error message");
    if(response.status === 401 || response.status === 403) {
      return {
        data: {error:errorMessage},
        type: "unauthorized",
        error: errorMessage,
      } as const
    } 
    return {
      data: {error:errorMessage},
      type: "error",
      error: errorMessage,
    } as const
  }

  const dataRes = await response.json();
  return {
    data: dataRes,
    type: "success",
    error: null,
  } as const;
}

export async function checkIfTokenIsValid({ token }: { token: string }) {
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

export async function getCurrentUser(api_key: string) {
  return fetchData<WakatimeUserResponse>("/api/v1/users/current", { api_key: api_key });
}

export async function getUserStats({
  api_key,
  start,
  end,
  project,
}: {
  api_key: string;
  start?: string;
  end?: string;
  project?: string;
}) {
  return fetchData<any>("/api/v1/users/current/stats", { start, end, project, api_key: api_key });
}

export async function getUserDurations({ date, api_key: api_key }: { date: string; api_key: string }) {
  return fetchData<UserDailyDurations>("/api/v1/users/current/durations", {
    date,
    api_key: api_key,
  });
}

// Leaderboard methods
export async function getLeaderboard({
  api_key,
  country,
  page,
  language,
}: {
  api_key: string;
  country?: string;
  page?: number;
  language?: string;
}) {
  return fetchData<WakatimeLeaderboard>("/api/v1/leaders", { country, page, language, api_key });
}

// export class WakatimeSDK {
//   private api_key: string;
//   private baseUrl: string;

//   constructor(api_key: string) {
//     this.api_key = api_key;
//     this.baseUrl = "https://wakatime.com";
//   }

//   private async fetchData<T = any>(endpoint: string, params: Record<string, any> = {}) {
//     const url = new URL(`${this.baseUrl}${endpoint}`);
//     params.api_key = this.api_key;
//     Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
//     // console.log("WakatimeSDK fetchData url: ===> ", url.toString());
//     const response = await fetch(url.toString());
//     if (!response.ok) {
//       return {
//         data: null,
//         type: "error",
//         error: `Error: ${response.status} ${response.statusText}`,
//       };
//     }
//     const dataRes = (await response.json()) as T;
//     // console.log("WakatimeSDK fetchData response: === ", dataRes);
//     return {
//       data: dataRes,
//       type: "success",
//       error: null,
//     };
//   }

//   // Static method that doesn't need an instance
//   static async checkIfTokenIsValid({ token }: { token: string }) {
//     const baseUrl = "https://wakatime.com";
//     if (!token || token.trim() === "") {
//       return {
//         isValid: false,
//         error: "Token is required",
//       };
//     }
//     const url = new URL(`${baseUrl}/api/v1/users/current`);
//     url.searchParams.append("api_key", token);

//     try {
//       const response = await fetch(url.toString());
//       if (!response.ok) {
//         return {
//           isValid: false,
//           error: `Error: ${response.status} ${response.statusText}`,
//         };
//       }

//       const { data } = await response.json();
//       return {
//         isValid: true,
//         data: data as WakatimeUser,
//       };
//     } catch (error) {
//       return {
//         isValid: false,
//         error: error instanceof Error ? error.message : String(error),
//       };
//     }
//   }

//   async getCurrentUser() {
//     return this.fetchData<WakatimeUserResponse>("/api/v1/users/current");
//   }

//   async getUserStats(params: { start?: string; end?: string; project?: string }) {
//     return this.fetchData("/api/v1/users/current/stats", params);
//   }

//   async getUserDurations(params: { date: string }) {
//     return this.fetchData<UserDailyDurations>("/api/v1/users/current/durations", params);
//   }

//   // Leaderboard methods
//   async getLeaderboard(params: { country?: string; page?: number; language?: string }) {
//     return this.fetchData<WakatimeLeaderboard>("/api/v1/leaders", params);
//   }

//   async getUserHeartbeats(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/heartbeats", params);
//   }
//   async getUserProjects(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/projects", params);
//   }
//   async getUserLanguages(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/languages", params);
//   }
//   async getUserEditors(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/editors", params);
//   }
//   async getUserOperatingSystems(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/os", params);
//   }
//   async getUserMetrics(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/metrics", params);
//   }
//   async getUserProjectsStats(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/projects/stats", params);
//   }
//   async getUserLanguagesStats(params: { start?: string; end?: string }) {
//     return this.fetchData("/api/v1/users/current/languages/stats", params);
//   }

//   async getCountryLeaderboard(params: { country: string; page?: number }) {
//     return this.fetchData("/api/v1/leaders", params);
//   }
// }

// export const wakatimeSDK$ = computed(() => {
//   const api_key = settings$.wakatime_api_key.get();
//   return api_key ? new WakatimeSDK(api_key) : null;
// });

// export function useWakatimeSDK() {
//   const sdk = use$(() => wakatimeSDK$.get());
//   return sdk;
// }
