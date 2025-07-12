const durations = {
  data: [
    {
      color: null,
      duration: 239.72895,
      project: "radaa",
      time: 1752124773.030862,
    },
    {
      color: null,
      duration: 19.264979,
      project: "moggin",
      time: 1752125012.759812,
    },
    {
      color: null,
      duration: 648.764183,
      project: "radaa",
      time: 1752125032.024791,
    },
    {
      color: null,
      duration: 21.93454,
      project: "moggin",
      time: 1752125680.788974,
    },
    {
      color: null,
      duration: 87.432673,
      project: "radaa",
      time: 1752125702.723514,
    },
    {
      color: null,
      duration: 22.454838,
      project: "moggin",
      time: 1752125790.156187,
    },
    {
      color: null,
      duration: 30.541829,
      project: "radaa",
      time: 1752125812.611025,
    },
    {
      color: null,
      duration: 8.136122,
      project: "moggin",
      time: 1752125843.152854,
    },
    {
      color: null,
      duration: 327.586097,
      project: "radaa",
      time: 1752125851.288976,
    },
    {
      color: null,
      duration: 32.052475,
      project: "moggin",
      time: 1752127676.257468,
    },
    {
      color: null,
      duration: 101.613442,
      project: "radaa",
      time: 1752127708.309943,
    },
    {
      color: null,
      duration: 14.194209,
      project: "moggin",
      time: 1752127809.923385,
    },
    {
      color: null,
      duration: 30.010921,
      project: "radaa",
      time: 1752127824.117594,
    },
    {
      color: null,
      duration: 29.245579,
      project: "moggin",
      time: 1752127854.128515,
    },
    {
      color: null,
      duration: 25.176183,
      project: "radaa",
      time: 1752127883.374094,
    },
    {
      color: null,
      duration: 0.0,
      project: "moggin",
      time: 1752128849.372626,
    },
    {
      color: null,
      duration: 2671.683582,
      project: "moggin",
      time: 1752131513.965283,
    },
    {
      color: null,
      duration: 72.724251,
      project: "moggin",
      time: 1752136707.633161,
    },
    {
      color: null,
      duration: 3686.073117,
      project: "moggin",
      time: 1752138517.414416,
    },
    {
      color: null,
      duration: 501.998091,
      project: "moggin",
      time: 1752147413.73536,
    },
    {
      color: null,
      duration: 11679.677765,
      project: "moggin",
      time: 1752149744.4717,
    },
    {
      color: null,
      duration: 637.793577,
      project: "moggin",
      time: 1752162395.196054,
    },
    {
      color: null,
      duration: 6146.448757,
      project: "moggin",
      time: 1752165331.717493,
    },
    {
      color: null,
      duration: 4488.515965,
      project: "moggin",
      time: 1752172379.099051,
    },
  ],
  end: "2025-07-10T20:59:59Z",
  start: "2025-07-09T21:00:00Z",
  timezone: "Africa/Nairobi",
};

// Mock response states for testing different scenarios
export type MockResponseState = 
  | 'success'
  | 'unauthorized' 
  | 'rate_limit_exceeded'
  | 'error'
  | 'network_error';

// Global mock state - can be changed to simulate different responses
let mockState: MockResponseState = 'success';

// Function to change mock state for testing
export function setMockState(state: MockResponseState) {
  mockState = state;
}

export function getMockState(): MockResponseState {
  return mockState;
}

// Mock user data
const mockUser = {
  data: {
    bio: null,
    categories_used_public: false,
    city: null,
    color_scheme: "dark",
    created_at: "2023-01-01T00:00:00Z",
    date_format: "YYYY-MM-DD",
    default_dashboard_range: "Last 7 Days",
    display_name: "Mock User",
    durations_slice_by: "project",
    editors_used_public: true,
    email: "mockuser@example.com",
    full_name: "Mock User",
    github_username: "mockuser",
    has_basic_features: true,
    has_premium_features: false,
    human_readable_website: null,
    id: "mock-user-id",
    invoice_counter: 0,
    invoice_id_format: "INV-{n}",
    is_email_confirmed: true,
    is_email_public: false,
    is_hireable: true,
    is_onboarding_finished: true,
    languages_used_public: true,
    last_branch: "main",
    last_heartbeat_at: "2025-07-12T12:00:00Z",
    last_language: "TypeScript",
    last_plugin: "vscode",
    last_plugin_name: "Visual Studio Code",
    last_project: "moggin",
    linkedin_username: null,
    location: "Mock City",
    logged_time_public: true,
    modified_at: "2025-07-12T12:00:00Z",
    needs_payment_method: false,
  }
};

// Mock leaderboard data
const mockLeaderboard = {
  data: [
    {
      rank: 1,
      running_total: {
        daily_average: 28800,
        human_readable_daily_average: "8 hrs",
        human_readable_total: "40 hrs",
        languages: [
          { name: "TypeScript", percent: 65.5, text: "26 hrs 12 mins" },
          { name: "JavaScript", percent: 25.2, text: "10 hrs 5 mins" },
          { name: "Python", percent: 9.3, text: "3 hrs 43 mins" }
        ],
        total_seconds: 144000
      },
      user: {
        display_name: "Mock Leader",
        email: "leader@example.com",
        full_name: "Mock Leader",
        id: "mock-leader-id",
        username: "mockleader"
      }
    }
  ],
  current_user: null,
  language: null,
  page: 1,
  per_page: 10,
  timeout: 15,
  total: 1,
  total_pages: 1,
  writes_only: false
};

// Mock data fetcher that simulates different response states
export async function mockFetchData<T = any>(
  endpoint: string,
  params: Record<string, any> & { api_key: string | null } = { api_key: null }
): Promise<{
  data: T | null;
  status: number;
  type: "success" | "unauthorized" | "rate_limit_exceeded" | "error";
  error: string | null;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return different responses based on mock state
  switch (mockState) {
    case 'unauthorized':
      return {
        data: null,
        type: "unauthorized",
        status: 401,
        error: "Unauthorized: Invalid API key",
      };

    case 'rate_limit_exceeded':
      return {
        data: null,
        type: "rate_limit_exceeded",
        status: 429,
        error: "Rate limit exceeded. Please try again later.",
      };

    case 'error':
      return {
        data: null,
        type: "error",
        status: 500,
        error: "Internal server error",
      };

    case 'network_error':
      return {
        data: null,
        type: "error",
        status: 0,
        error: "Network error: Unable to connect to server",
      };

    case 'success':
    default:
      // Return appropriate mock data based on endpoint
      let mockData: any = null;
      
      if (endpoint.includes('/users/current/durations')) {
        mockData = durations;
      } else if (endpoint.includes('/users/current')) {
        mockData = mockUser;
      } else if (endpoint.includes('/leaders')) {
        mockData = mockLeaderboard;
      } else {
        mockData = { message: "Mock data for " + endpoint };
      }

      return {
        data: mockData as T,
        status: 200,
        type: "success",
        error: null,
      };
  }
}

// Mock versions of your SDK functions
export async function mockGetCurrentUser(api_key: string) {
  return mockFetchData("/api/v1/users/current", { api_key });
}

export async function mockGetUserDurations({ date, api_key }: { date: string; api_key: string }) {
  return mockFetchData("/api/v1/users/current/durations", { date, api_key });
}

export async function mockGetLeaderboard({
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
  return mockFetchData("/api/v1/leaders", { country, page, language, api_key });
}

export async function mockCheckIfTokenIsValid({ token }: { token: string }) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!token || token.trim() === "") {
    return {
      isValid: false,
      error: "Token is required",
    };
  }

  switch (mockState) {
    case 'unauthorized':
      return {
        isValid: false,
        error: "Error: 401 Unauthorized",
      };

    case 'rate_limit_exceeded':
      return {
        isValid: false,
        error: "Error: 429 Rate limit exceeded",
      };

    case 'error':
      return {
        isValid: false,
        error: "Error: 500 Internal server error",
      };

    case 'network_error':
      return {
        isValid: false,
        error: "Network error: Unable to connect to server",
      };

    case 'success':
    default:
      return {
        isValid: true,
        data: mockUser.data,
      };
  }
}

// Helper function to cycle through different states for testing
export function cycleMockState() {
  const states: MockResponseState[] = ['success', 'unauthorized', 'rate_limit_exceeded', 'error', 'network_error'];
  const currentIndex = states.indexOf(mockState);
  const nextIndex = (currentIndex + 1) % states.length;
  mockState = states[nextIndex];
  console.log(`Mock state changed to: ${mockState}`);
  return mockState;
}

// Export mock data for direct use if needed
export const mockData = {
  durations,
  user: mockUser,
  leaderboard: mockLeaderboard,
};
