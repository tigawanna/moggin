// Note: This is a mock implementation for demonstration purposes
// To implement actual Spotify integration, you'll need to:
// 1. Register your app with Spotify for Developers
// 2. Implement OAuth 2.0 flow for authentication
// 3. Use the Spotify Web API endpoints

export class SpotifySDK {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.spotify.com/v1';
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
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
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

  // Static method to validate access token (mock implementation)
  static async checkIfTokenIsValid({ token }: { token: string }) {
    // In a real implementation, you would validate the token against Spotify API
    // For now, this is just a mock validation
    if (!token || token.length < 10) {
      return {
        isValid: false,
        error: 'Invalid token format',
      };
    }

    // Mock successful validation
    return {
      isValid: true,
      data: {
        scope: 'user-read-recently-played user-read-playback-state user-read-currently-playing',
        token_type: 'Bearer'
      },
    };
  }

  async getCurrentUser() {
    return this.fetchData('/me');
  }

  async getRecentlyPlayed(params: { limit?: number; after?: number; before?: number } = {}) {
    return this.fetchData('/me/player/recently-played', params);
  }

  async getCurrentPlayback() {
    return this.fetchData('/me/player');
  }

  async getUserPlaylists(params: { limit?: number; offset?: number } = {}) {
    return this.fetchData('/me/playlists', params);
  }

  async getTopTracks(params: { 
    time_range?: 'short_term' | 'medium_term' | 'long_term';
    limit?: number;
    offset?: number;
  } = {}) {
    return this.fetchData('/me/top/tracks', params);
  }

  async getTopArtists(params: { 
    time_range?: 'short_term' | 'medium_term' | 'long_term';
    limit?: number;
    offset?: number;
  } = {}) {
    return this.fetchData('/me/top/artists', params);
  }

  async getUserProfile() {
    return this.fetchData('/me');
  }

  async getPlaylist(playlistId: string, params: { fields?: string } = {}) {
    return this.fetchData(`/playlists/${playlistId}`, params);
  }
}

// Type definitions for Spotify API responses
export type SpotifyUser = {
  id: string;
  display_name: string;
  email: string;
  followers: {
    total: number;
  };
  images: {
    url: string;
    height?: number;
    width?: number;
  }[];
  country: string;
  product: string;
};

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      height?: number;
      width?: number;
    }[];
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
};

export type SpotifyArtist = {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: {
    url: string;
    height?: number;
    width?: number;
  }[];
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description?: string;
  tracks: {
    total: number;
  };
  images: {
    url: string;
    height?: number;
    width?: number;
  }[];
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  collaborative: boolean;
  external_urls: {
    spotify: string;
  };
};

export type SpotifyRecentlyPlayed = {
  items: {
    track: SpotifyTrack;
    played_at: string;
    context?: {
      type: 'album' | 'artist' | 'playlist';
      href: string;
      external_urls: {
        spotify: string;
      };
    };
  }[];
  next?: string;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
};
