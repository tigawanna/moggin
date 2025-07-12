// Durations
// GET /api/v1/users/:user/durations

// GET /api/v1/users/current/durations

// Description
// A user's coding activity for the given day as an array of durations. Durations are read-only representations of Heartbeats, created by joining multiple Heartbeats together when they’re within 15 minutes of each other. The 15 minutes default can be changed with your account’s Keystroke Timeout preference.

// URL Parameters
// date - Date - required - Requested day; Durations will be returned from 12am until 11:59pm in user's timezone for this day.

// project - String - optional - Only show durations for this project.

// branches - String - optional - Only show durations for these branches; comma separated list of branch names.

// timeout - Integer - optional - The keystroke timeout preference used when joining heartbeats into durations. Defaults the the user's keystroke timeout value. See the FAQ for more info.

// writes_only - Boolean - optional - The writes_only preference. Defaults to the user's writes_only setting.

// timezone - String - optional - The timezone for given date. Defaults to the user's timezone.
// slice_by - String - optional - Optional primary key to use when slicing durations. Defaults to “project”. Can be “project”, “entity”, “language”, “dependencies”, “os”, “editor”, “category”, or “machine”.
      
// https://wakatime.com/api/v1/users/current/durations?date=2025-07-11

const userdurationsDefaultResponse = {
  data: [
 {
      color: null,
      duration: 29.049361,
      project: "applications",
      time: 1752219238.506187,
    },
    {
      color: null,
      duration: 39.904764,
      project: "moggin",
      time: 1752219267.555548,
    },
    {
      color: null,
      duration: 8.987373,
      project: "applications",
      time: 1752221025.118889,
    },

    {
      color: null,
      duration: 2299.987159,
      project: "moggin",
      time: 1752227823.845737,
    },
    {
      color: null,
      duration: 7.441811,
      project: "moggin",
      time: 1752233012.963944,
    },

  ],
  end: "2025-07-11T20:59:59Z",
  start: "2025-07-10T21:00:00Z",
  timezone: "Africa/Nairobi",
};

export interface UserDailyDurations {
  data: UserDailyDurationsData[];
  end: string;
  start: string;
  timezone: string;
};
export interface UserDailyDurationsData {
  color: string | null;
  duration: number;
  project: string;
  time: number;
}

//https://wakatime.com/api/v1/users/current/durations?date=2025-07-11&slice_by=dependencies
const exampleDailyDurationWithDependenciesResponse = {
  data: {
    "@babel/core": [
      {
        dependencies: "@babel/core",
        duration: 571.444503,
        project: "moggin",
        time: 1752261992.230102,
      },
    ],
    "@expo/vector-icons": [
      {
        dependencies: "@expo/vector-icons",
        duration: 46.178884,
        project: "moggin",
        time: 1752260944.016311,
      },
      {
        dependencies: "@expo/vector-icons",
        duration: 571.444503,
        project: "moggin",
        time: 1752261992.230102,
      },
    ],
  },
  end: "2025-07-11T20:59:59Z",
  start: "2025-07-10T21:00:00Z",
  timezone: "Africa/Nairobi",
};
export interface UserDailyDurationsWithDependencies {
  data: DependenciesData;
  end: string;
  start: string;
  timezone: string;
}
export type DependenciesData = Record<string, Record<string, string|number>>;

// "https://wakatime.com/api/v1/users/current/durations?date=2025-07-11&slice_by=language"

const exampleDailyDurationWithLanguagesResponse = {
  data: [
      {
        "duration": 571.444503,
        "language": "JSON",
        "project": "moggin",
        "time": 1752261992.230102
      },
      {
        "duration": 847.482091,
        "language": "TypeScript",
        "project": "moggin",
        "time": 1752262563.674605
      },
      {
        "duration": 861.424428,
        "language": "Kotlin",
        "project": "moggin",
        "time": 1752263411.156696
      }
    ],
    "end": "2025-07-11T20:59:59Z",
    "start": "2025-07-10T21:00:00Z",
    "timezone": "Africa/Nairobi"
}
export interface UserDailyDurationsWithLanguages {
  data: UserDailyDurationsWithLanguagesData[];
  end: string;
  start: string;
  timezone: string;
}
export interface UserDailyDurationsWithLanguagesData {
  duration: number;
  language: string;
  project: string;
  time: number;
}

//https://wakatime.com/api/v1/users/current/durations?date=2025-07-11&slice_by=editor

const exampleDailyDurationWithEditorsResponse = {
  data: [
    {
      duration: 0.0,
      editor: "VS Code",
      project: "dennis",
      time: 1752213850.265581,
    },
    {
      duration: 6586.617991,
      editor: "VS Code",
      project: "Bidii-kotlin-widget",
      time: 1752215148.799692,
    },
    {
      duration: 2280.351022,
      editor: "VS Code",
      project: "moggin",
      time: 1752261992.230102,
    },
  ],
  end: "2025-07-11T20:59:59Z",
  start: "2025-07-10T21:00:00Z",
  timezone: "Africa/Nairobi",
};

export interface UserDailyDurationsWithEditors {
  data: UserUserDailyDurationsWithEditors[];
  end: string;
  start: string;
  timezone: string;
}
export interface UserUserDailyDurationsWithEditors {
  duration: number;
  editor: string;
  project: string;
  time: number;
}
