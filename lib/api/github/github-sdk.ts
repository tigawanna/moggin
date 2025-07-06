export class GitHubSDK {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.github.com";
  }

  private async fetchData(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters if any
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `token ${this.apiKey}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      data,
      error: null,
    };
  }

  // Static method to verify a token without needing an instance
  static async checkIfTokenIsValid({ token }: { token: string }) {
    const url = new URL("https://api.github.com/user");
    if(!token || token.trim() === "") {
      return {
        isValid: false,
        error: "Token is required",
      };
    }
    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        return {
          isValid: false,
          error: `Error: ${response.status} ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        isValid: true,
        data: data as GitHubUser,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async getCurrentUser() {
    return this.fetchData("/user");
  }

  async getRepositories(
    params: {
      sort?: "created" | "updated" | "pushed" | "full_name";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
      visibility?: "all" | "public" | "private";
    } = {}
  ) {
    return this.fetchData("/user/repos", params);
  }

  async getStarredRepositories(
    params: {
      sort?: "created" | "updated";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData("/user/starred", params);
  }

  async getUserActivity(params: { per_page?: number; page?: number } = {}) {
    return this.fetchData("/users/events", params);
  }

  async getRepository(owner: string, repo: string) {
    return this.fetchData(`/repos/${owner}/${repo}`);
  }

  async getRepositoryCommits(
    owner: string,
    repo: string,
    params: {
      sha?: string;
      path?: string;
      author?: string;
      since?: string;
      until?: string;
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData(`/repos/${owner}/${repo}/commits`, params);
  }

  async getRepositoryIssues(
    owner: string,
    repo: string,
    params: {
      state?: "open" | "closed" | "all";
      sort?: "created" | "updated" | "comments";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData(`/repos/${owner}/${repo}/issues`, params);
  }

  async getRepositoryPullRequests(
    owner: string,
    repo: string,
    params: {
      state?: "open" | "closed" | "all";
      sort?: "created" | "updated" | "popularity" | "long-running";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData(`/repos/${owner}/${repo}/pulls`, params);
  }

  async searchRepositories(
    query: string,
    params: {
      sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
      order?: "asc" | "desc";
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData(`/search/repositories`, { q: query, ...params });
  }

  async getNotifications(
    params: {
      all?: boolean;
      participating?: boolean;
      since?: string;
      before?: string;
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData("/notifications", params);
  }

  async getGists(
    params: {
      since?: string;
      per_page?: number;
      page?: number;
    } = {}
  ) {
    return this.fetchData("/gists", params);
  }

  async getOrganizations() {
    return this.fetchData("/user/orgs");
  }
}

export type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan?: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
};

export type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  archived: boolean;
  disabled: boolean;
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
};

export type GitHubUserResponse = {
  data: GitHubUser | null;
  error?: string | null;
};

export type GitHubRepositoriesResponse = {
  data: GitHubRepository[] | null;
  error?: string | null;
};
