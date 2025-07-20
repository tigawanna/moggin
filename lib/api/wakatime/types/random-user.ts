export type WakatimeRandomUserResponse = {
  data: WakatimeRandomUser | null;
  status: string;
  error?: string | null;
};

export interface WakatimeRandomUser {
  bio: string;
  categories_used_public: boolean;
  city: City;
  created_at: string;
  display_name: string;
  editors_used_public: boolean;
  full_name: string;
  github_username: string;
  human_readable_website: string;
  id: string;
  is_email_confirmed: boolean;
  is_email_public: boolean;
  is_hireable: boolean;
  languages_used_public: boolean;
  linkedin_username: string;
  logged_time_public: boolean;
  os_used_public: boolean;
  photo: string;
  photo_public: boolean;
  profile_url: string;
  profile_url_escaped: string;
  public_email: string;
  public_profile_time_range: string;
  share_all_time_badge: boolean;
  share_last_year_days: boolean;
  twitter_username: string;
  username: string;
  website: string;
  wonderfuldev_username: string;
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
