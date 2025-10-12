export interface WakatimeLeaderboard {
  country_code: any;
  current_user: CurrentUser;
  data: LeaderboardEntry[];
  is_hireable: boolean;
  language: any;
  modified_at: string;
  page: number;
  range: Range;
  timeout: number;
  total_pages: number;
  writes_only: boolean;
}

export interface CurrentUser {
  page: number;
  rank: number;
  user: User;
}

export interface User {
  city: City;
  display_name: string;
  email: any;
  full_name: string;
  human_readable_website: string;
  id: string;
  is_email_public: boolean;
  is_hireable: boolean;
  photo: string;
  photo_public: boolean;
  username: string;
  website: string;
}

export interface City {
  ascii_name: string;
  ascii_state: string;
  country: string;
  country_code: string;
  id: string;
  name: string;
  population: number;
  short_title: string;
  state: string;
  timezone: string;
  title: string;
}

export interface LeaderboardEntry {
  rank: number;
  running_total: RunningTotal;
  user: User2;
}

export interface RunningTotal {
  daily_average: number;
  human_readable_daily_average: string;
  human_readable_total: string;
  languages: Language[];
  languages_html: string;
  total_seconds: number;
}

export interface Language {
  name: string;
  total_seconds: number;
}

export interface User2 {
  city?: City2;
  display_name: string;
  email: any;
  full_name: string;
  human_readable_website: string;
  id: string;
  is_email_public: boolean;
  is_hireable: boolean;
  location?: string;
  photo: string;
  photo_public: boolean;
  username?: string;
  website: string;
}

export interface City2 {
  ascii_name: string;
  ascii_state: string;
  country: string;
  country_code: string;
  id: string;
  name: string;
  population: number;
  short_title: string;
  state: string;
  timezone: string;
  title: string;
  title_including_country: string;
}

export interface Range {
  end_date: string;
  end_text: string;
  name: string;
  start_date: string;
  start_text: string;
  text: string;
}
