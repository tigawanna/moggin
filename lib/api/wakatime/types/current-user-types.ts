export interface UserDailyDurations {
  data: UserDailyDurationsData[];
  end: string;
  start: string;
  timezone: string;
}

export interface UserDailyDurationsData {
  color: any;
  duration: number;
  project: string;
  time: number;
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
