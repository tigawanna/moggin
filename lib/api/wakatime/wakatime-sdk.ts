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
  console.log(" 🌎 Fetching Wakatime data from: >> ", url.toString());
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
        data:null,
        type: "unauthorized",
        error: errorMessage,
      } as const
    } 
    return {
      data: null,
      type: "error",
      error: errorMessage,
    } as const
  }
  type WakatimeUserResponse = {
    data: WakatimeUser | null;
  };
  const dataRes = (await response.json()) as WakatimeUserResponse;
  return {
    data:dataRes,
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
export async function getLeaderboard(params: {
  api_key: string;
  country_code?: string;
  page?: number;
  language?: string;
}) {
  return fetchData<WakatimeLeaderboard>("/api/v1/leaders", { ...params });
}


