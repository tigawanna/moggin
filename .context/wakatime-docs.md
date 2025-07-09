All Time Since Today
GET /api/v1/users/:user/all_time_since_today

GET /api/v1/users/current/all_time_since_today

Description
The total time logged since account created, available even for Free accounts.

URL Parameters
project - String - optional - Shows the total time for a project, since project created.

Scope Required
read_stats

Example Response
Response Code: 200

{
  "data": {
    "daily_average": <float: average coding activity per day as seconds for the given range of time, including Other language>,
    "decimal": <string: total coding activity in decimal format>,
    "digital": <string: total coding activity in digital clock format>,
    "is_up_to_date": <boolean: true if the stats are up to date; when false, a 202 response code is returned and stats will be refreshed soon>,
    "percent_calculated": <integer: a number between 0 and 100 where 100 means the stats are up to date including Today’s time>,
    "range": {
      "end": <string: end of today as ISO 8601 UTC datetime>,
      "end_date": <string: today as Date string in YEAR-MONTH-DAY format>,
      "end_text": <string: today in human-readable format>,
      "start": <string: start of user created day as ISO 8601 UTC datetime>,
      "start_date": <string: day user was created in YEAR-MONTH-DAY format>,
      "start_text": <string: day user was created in human-readable format>,
      "timezone": <string: timezone used in Olson Country/Region format>
    }
    "text": <string: total time logged since account created as human readable string>,
    "timeout": <integer: keystroke timeout setting in minutes>,
    "total_seconds": <float: total number of seconds logged since account created>,
  }
}
Try it out

Commit
GET /api/v1/users/:user/projects/:project/commits/:hash

GET /api/v1/users/current/projects/:project/commits/:hash

Description
A single commit from a WakaTime project showing the time spent coding on the commit.

URL Parameters
branch - String - optional - Filter the commit to a branch; defaults to the repo’s default branch name.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "commit": {
    "author_avatar_url": <string: url of author's avatar image>
    "author_date": <string: time when commit was authored in ISO 8601 format>,
    "author_email": <string: email address of author>,
    "author_html_url": <string: link to author's profile on GitHub, Bitbucket, GitLab, etc>,
    "author_name": <string: name of author>,
    "author_url": <string: api url for author's profile>,
    "author_username": <string: author's username>,
    "branch": <string: branch name, for ex: master>,
    "committer_avatar_url": <string: url of committer's avatar image>,
    "committer_date": <string: commit time in ISO 8601 format>,
    "committer_email": <string: email address of committer>,
    "committer_html_url": <string: link to committer's profile on GitHub, Bitbucket, GitLab, etc>,
    "committer_name": <string: name of committer>,
    "committer_url": <string: api url for committer's profile>,
    "committer_username": <string: committer's username>,
    "created_at": <string: time commit was synced in ISO 8601 format>,
    "hash": <string: revision control hash of this commit>,
    "html_url": <string: link to an html page with details about current commit>,
    "human_readable_total": <string: time coded in editor for this commit>,
    "human_readable_total_with_seconds": <string: time coded in editor for this commit>,
    "id": <string: unique id of commit>,
    "message": <string: author's description of this commit>,
    "ref": <string: refs/heads/master>,
    "total_seconds": <float: time coded in editor for this commit>,
    "truncated_hash": <string: truncated revision control hash of this commit>,
    "url": <string: api url with details about current commit>,
  },
  "branch": <string: branch name containting the commit>,
  "project": {
    "id": <string: unique id of project>,
    "name": <string: project name>,
    "privacy": <string: project privacy setting>,
    "repository": {
      "default_branch": <string: default branch if given for this repo>,
      "description": <string: remote repository description>,
      "fork_count": <integer: number of repo forks if available>
      "full_name": <string: username and repo name, ex: wakatime/wakadump>,
      "homepage": <string: homepage of repository>,
      "html_url": <string: html url for repository>,
      "id": <string: unique id of repository>,
      "is_fork": <boolean: whether this repo is a fork or original>,
      "is_private": <boolean: whether this repo is private or public>,
      "last_synced_at": <string: last time this repo was synced with remote provider iSO 8601 format>,
      "name": <string: repository name>,
      "provider": <string: remote provider of repository, ex: github>,
      "star_count": <integer: number of repo stars if available>
      "url": <string: api url of remote repository>,
      "watch_count": <integer: number of watchers of repo if available>,
    }
  },
  "status": <string: project's sync status>,
}
Commits
GET /api/v1/users/:user/projects/:project/commits

GET /api/v1/users/current/projects/:project/commits

Description
List of commits for a WakaTime project showing the time spent coding in each commit.

URL Parameters
author - String - optional - Filter commits to only those authored by the given username.

branch - String - optional - Filter commits to a branch; defaults to the repo’s default branch name.

page - Integer - optional - Page number of commits.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "commits": [
    {
      "author_avatar_url": <string: url of author's avatar image>
      "author_date": <string: time when commit was authored in ISO 8601 format>,
      "author_email": <string: email address of author>,
      "author_html_url": <string: link to author's profile on GitHub, Bitbucket, GitLab, etc>,
      "author_name": <string: name of author>,
      "author_url": <string: api url for author's profile>,
      "author_username": <string: author's username>,
      "branch": <string: branch name, for ex: master>,
      "committer_avatar_url": <string: url of committer's avatar image>,
      "committer_date": <string: commit time in ISO 8601 format>,
      "committer_email": <string: email address of committer>,
      "committer_html_url": <string: link to committer's profile on GitHub, Bitbucket, GitLab, etc>,
      "committer_name": <string: name of committer>,
      "committer_url": <string: api url for committer's profile>,
      "committer_username": <string: committer's username>,
      "created_at": <string: time commit was synced in ISO 8601 format>,
      "hash": <string: revision control hash of this commit>,
      "html_url": <string: link to an html page with details about current commit>,
      "human_readable_total": <string: time coded in editor for this commit>,
      "human_readable_total_with_seconds": <string: time coded in editor for this commit>,
      "id": <string: unique id of commit>,
      "message": <string: author's description of this commit>,
      "ref": <string: refs/heads/master>,
      "total_seconds": <float: time coded in editor for this commit>,
      "truncated_hash": <string: truncated revision control hash of this commit>,
      "url": <string: api url with details about current commit>,
    }, …
  ],
  "author": <string: current author or null if showing commits from all authors>,
  "next_page": <integer: next page number or null if last page>
  "next_page_url": <string: url for next page or null if last page>
  "page": <integer: current page number>
  "prev_page": <integer: previous page number or null if first page>
  "prev_page_url": <string: url for previous page or null if first page>
  "branch": <string: branch name containting the commits>,
  "project": {
    "id": <string: unique id of project>,
    "name": <string: project name>,
    "privacy": <string: project privacy setting>,
    "repository": {
      "default_branch": <string: default branch if given for this repo>,
      "description": <string: remote repository description>,
      "fork_count": <integer: number of repo forks if available>
      "full_name": <string: username and repo name, ex: wakatime/wakadump>,
      "homepage": <string: homepage of repository>,
      "html_url": <string: html url for repository>,
      "id": <string: unique id of repository>,
      "is_fork": <boolean: whether this repo is a fork or original>,
      "is_private": <boolean: whether this repo is private or public>,
      "last_synced_at": <string: last time this repo was synced with remote provider iSO 8601 format>,
      "name": <string: repository name>,
      "provider": <string: remote provider of repository, ex: github>,
      "star_count": <integer: number of repo stars if available>
      "url": <string: api url of remote repository>,
      "watch_count": <integer: number of watchers of repo if available>,
    }
  },
  "status": <string: project's sync status>,
  "total": <integer: number of commits available>,
  "total_pages": <integer: number of pages available>,
}
Custom Rules
GET /api/v1/users/:user/custom_rules

GET /api/v1/users/current/custom_rules

Description
List of custom rules for this user.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of this custom rule>,
      "action": <string: either "change" or "delete">,
      "source": <string: the heartbeat property to match against source_value>,
      "operation": <string: one of "equals", "contains", "starts with", or "ends with">,
      "source_value": <string: the match string>,
      "destination": <string: the heartbeat property to replace with destination_value>,
      "destination_value": <string: the replacement string>,
      "created_at": <string: time when this custom rule was created in ISO 8601 format>,
      "modified_at": <string: time when this custom rule was last modified in ISO 8601 format>,
      "priority": <integer: a unique number determining the order this rule is executed on heartbeats; starts with 1; lower priorities are executed before higher priorities>,
    }, …
  ],
  "job_id": <string: optional id representing the custom rule progress, if being applied to past code stats; can be used to check the job progress>,
}
Try it out

DELETE /api/v1/users/:user/custom_rules/:rule_id

DELETE /api/v1/users/current/custom_rules/:rule_id

Description
Deletes a single custom rule. Does not trigger applying custom rules to past code stats, and doesn’t abort any current job if already running.

Scope Required
write_heartbeats

Example Response
Response Code: 200

{
  "data": {}
}
PUT /api/v1/users/:user/custom_rules

PUT /api/v1/users/current/custom_rules

Description
Updates a user’s custom rules. Accepts an array of rules to replace/update the user’s existing rules.

Scope Required
write_heartbeats

JSON POST Data
[
  {
    "id": <string: optional id of an existing custom rule>,
    "action": <string: either "change" or "delete">,
    "source": <string: the heartbeat property to match against source_value>,
    "operation": <string: one of "equals", "contains", "starts with", or "ends with">,
    "source_value": <string: the match string>,
    "destination": <string: the heartbeat property to replace with destination_value>,
    "destination_value": <string: the replacement string>,
    "priority": <integer: a unique number determining the order this rule is executed on heartbeats; starts with 1; lower priorities are executed before higher priorities>,
  }, …
]
Example Response
Response Code: 200

{
  "data": {
    "changes": {
      "added": [],
      "removed": [],
      "rearranged": [],
    },
    "job_id": <string: unique id representing the background job applying all current custom rules to user’s past code stats; can be used to check the job’s progress>,
  }
}
Custom Rules Progress
GET /api/v1/users/:user/custom_rules_progress

GET /api/v1/users/current/custom_rules_progress

Description
The background progress if currently applying custom rules to this user’s past code stats.

URL Parameters
job_id - String - required - The job_id to check.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": {
    "progress": <integer: a number between 0 and 100>,
    "job_id": <string: id of the custom rule progress job>,
  },
}
DELETE /api/v1/users/:user/custom_rules_progress

DELETE /api/v1/users/current/custom_rules_progress

Description
Aborts applying current custom rules to user’s past code stats. Custom rules will still be applied to any new incoming heartbeats.

Scope Required
write_heartbeats

Example Response
Response Code: 200

{
  "data": {}
}
Data Dumps
GET /api/v1/users/:user/data_dumps

GET /api/v1/users/current/data_dumps

Description
List data exports for the user. A data export can also be created at https://wakatime.com/settings, and contains all the user’s code stats as daily Summaries in JSON format since the user’s account was created.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of this data export>,
      "status": <string: one of 'Pending…', 'Processing coding activity…', 'Uploading…', or 'Completed'>,
      "percent_complete": <float: percent of code stats that have been exported>,
      "download_url": <string: when completed, the url to download this data export>,
      "type": <string: either 'heartbeats' or 'daily'>,
      "is_processing": <boolean: whether this data export is currently processing in the background>,
      "is_stuck": <boolean: whether this data export is taking too long, probably due to an error>,
      "has_failed": <boolean: whether this data export failed to complete due to an error>,
      "expires": <string: datetime when this data export can no longer be downloaded>,
      "created_at": <string: datetime when this data export was requested>,
    }, …
  ],
}
Try it out

POST /api/v1/users/:user/data_dumps

POST /api/v1/users/current/data_dumps

Description
Start generating a data export in the background. When finished, the percent complete will be 100 and the status 'Completed', with a 'download_url' available for downloading. An email will also be sent to the user with the download url when exporting completed.

Scope Required
read_heartbeats

JSON POST Data
{
  "type": <string: Required export type; Either 'daily' or 'heartbeats'>,
  "email_when_finished": <boolean: Optional flag to disable the email notification when exporting completed; defaults to true>,
}
Example Response
Response Code: 201

{
  "data": {
    "id": <string: unique id of this data export>,
    "status": <string: one of 'Pending…', 'Processing coding activity…', 'Uploading…', or 'Completed'>,
    "percent_complete": <float: percent of code stats that have been exported>,
    "download_url": <string: when completed, the url to download this data export>,
    "type": <string: either 'heartbeats' or 'daily'>,
    "is_processing": <boolean: whether this data export is currently processing in the background>,
    "is_stuck": <boolean: whether this data export is taking too long, probably due to an error>,
    "has_failed": <boolean: whether this data export failed to complete due to an error>,
    "expires": <string: datetime when this data export can no longer be downloaded>,
    "created_at": <string: datetime when this data export was requested>,
  },
}
Durations
GET /api/v1/users/:user/durations

GET /api/v1/users/current/durations

Description
A user's coding activity for the given day as an array of durations. Durations are read-only representations of Heartbeats, created by joining multiple Heartbeats together when they’re within 15 minutes of each other. The 15 minutes default can be changed with your account’s Keystroke Timeout preference.

URL Parameters
date - Date - required - Requested day; Durations will be returned from 12am until 11:59pm in user's timezone for this day.

project - String - optional - Only show durations for this project.

branches - String - optional - Only show durations for these branches; comma separated list of branch names.

timeout - Integer - optional - The keystroke timeout preference used when joining heartbeats into durations. Defaults the the user's keystroke timeout value. See the FAQ for more info.

writes_only - Boolean - optional - The writes_only preference. Defaults to the user's writes_only setting.

timezone - String - optional - The timezone for given date. Defaults to the user's timezone.

slice_by - String - optional - Optional primary key to use when slicing durations. Defaults to “project”. Can be “project”, “entity”, “language”, “dependencies”, “os”, “editor”, “category”, or “machine”.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": [
    {
      "project": <string: project name>,
      "time": <float: start of this duration as UNIX epoch; numbers after decimal point are fractions of a second>,
      "duration": <float: length of time of this duration in seconds>
    }, …
  ],
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
  "timezone": <string: timezone used for this request in Olson Country/Region format>
}
Try it out

Editors
GET /api/v1/editors

Description
List of WakaTime IDE plugins, latest plugin versions, and their color used on WakaTime charts.

URL Parameters
unreleased - Boolean - optional - Include unreleased plugins.

Example Response
Response Code: 200

{
  "data": {
    "id": <string: unique id of this editor plugin>,
    "name": <string: display name of the editor>,
    "color": <string: hex color code used when displaying the editor on charts>,
    "website": <string: official website of the editor>,
    "repository": <string: github repository for the editor’s plugin>,
    "version": <string: most recent plugin version available for this editor>,
    "version_url": <string: remote file containing this editor’s most recent version>,
    "history_url": <string: changelog file>,
    "released": <boolean: whether this IDE has a WakaTime plugin available>,
    "hidden": <boolean: whether this IDE has been deprecated or archived, ex: Atom>,
  },
}
Try it out

External Durations
GET /api/v1/users/:user/external_durations

GET /api/v1/users/current/external_durations

Description
A user's external durations for the given day. External durations aren’t created by IDE plugins. They’re created from external apps, such as the Google Calendar integration. They should be reproducible from the external integration. External durations for an integration are deleted when the user disconnects the integration from their WakaTime account.

URL Parameters
date - Date - required - Requested day; Durations will be returned from 12am until 11:59pm in user's timezone for this day.

project - String - optional - Only show durations for this project.

branches - String - optional - Only show durations for these branches; comma separated list of branch names.

timezone - String - optional - The timezone for given date. Defaults to the user's timezone.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of this external duration>,
      "external_id": <string: unique identifier for this duration on the external provider>,
      "entity": <string: entity duration is logging time against, such as an absolute file path or domain; for Google Calendar events, this will be the event title>,
      "type": <string: type of entity; can be file, app, or domain>,
      "provider": <string: external app which created this activity>,
      "category": <string: category for this activity; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, communicating, code reviewing, researching, learning, designing, or ai coding>,
      "start_time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
      "end_time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
      "project": <string: project name>,
      "branch": <string: branch name>,
      "language": <string: language name>,
      "meta": <string: a metadata string value; for Google Calendar events, this will be the event description>,
    }, …
  ],
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
  "timezone": <string: timezone used for this request in Olson Country/Region format>
}
Try it out

POST /api/v1/users/:user/external_durations

POST /api/v1/users/current/external_durations

POST /api/v1/users/:user/external_durations.bulk

POST /api/v1/users/current/external_durations.bulk

Description
Creates a duration representing activity for a user with start and end time, when Heartbeat pings aren’t available. For ex: meetings. External durations are not created by IDE plugins, only OAuth apps can create external durations. External durations must be created within one year from Today, and must not start before the associated user’s account was created. Use external_id to prevent creating duplicate durations. Using the same external_id will update any existing duration with the provided attributes. The bulk endpoint accepts an array of external durations, limited to 1,000 per POST request. The bulk endpoint will return 201 response status code with an array of status_codes for each duration sent. That’s because most invalid durations can be ommitted without problems while still allowing your app’s valid durations.

Scope Required
write_heartbeats

JSON POST Data
{
  "external_id": <string: unique identifier for this duration on the external provider>,
  "entity": <string: entity which this duration is logging time towards, such as an absolute file path or a domain>,
  "type": <string: type of entity; can be file, app, or domain>,
  "category": <string: category for this activity (optional); normally this is inferred automatically from type; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, communicating, code reviewing, researching, learning, designing, or ai coding>,
  "start_time": <float: UNIX epoch timestamp when the activity started; numbers after decimal point are fractions of a second>,
  "end_time": <float: UNIX epoch timestamp when the activity ended; numbers after decimal point are fractions of a second>,
  "project": <string: project name (optional)>,
  "branch": <string: branch name (optional)>,
  "language": <string: language name (optional)>,
  "meta": <string: A metadata string value with max length 2083. Only used by custom rules for equals, contains, starts with, ends with matching. Can be any string value you want. (optional)>,
}
Example Response
Response Code: 201

{
  "data": {
    "id": <string: unique id of this external duration>,
    "external_id": <string: unique identifier for this duration on the external provider>,
    "entity": <string: entity duration is logging time against, such as an absolute file path or domain; for Google Calendar events, this will be the event title>,
    "type": <string: type of entity; can be file, app, or domain>,
    "provider": <string: external app which created this activity>,
    "category": <string: category for this activity; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, communicating, code reviewing, researching, learning, designing, or ai coding>,
    "start_time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
    "end_time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
    "project": <string: project name (optional)>,
    "branch": <string: branch name (optional)>,
    "language": <string: language name (optional)>,
    "meta": <string: optional metadata string value; for Google Calendar events, this will be the event description>,
  },
}
DELETE /api/v1/users/:user/external_durations.bulk

DELETE /api/v1/users/current/external_durations.bulk

Description
Permanently deletes ExternalDurations, removing the deleted stats from all dashboards.

Scope Required
write_heartbeats

JSON POST Data
{
  "date": <string: A date in format YYYY-MM-DD. ExternalDurations will only be deleted for the given date from 12am until 11:59pm in user's timezone>,
  "ids": <list: A list of string ExternalDuration IDs to delete.>,
}
Example Response
Response Code: 200

{
  "data": {}
}
Goal
GET /api/v1/users/:user/goals/:goal

GET /api/v1/users/current/goals/:goal

Description
A single goal. This endpoint is only backed by cached data, similar to the Status Bar endpoint. If there’s no data yet in the cache, an empty Goal is returned while the cache updates in the background:
{"data":{"chart_data":[]}}.
Notice the keys present in the empty response are the only ones necessary for the wakatime-cli --today-goal command.

Scope Required
read_goals

Example Response
Response Code: 200

{
  "cached_at": <string: when this response was calculated and cached as ISO 8601 UTC datetime>,
  "data": {
    "average_status": <string: "fail" when there are more failure days or weeks than success, otherwise "success">,
    "chart_data": [
      {
        "actual_seconds": <float: number of seconds coded during this delta period>,
        "actual_seconds_text": <string: human readable time coded during this delta period>,
        "goal_seconds": <integer: number of seconds required to meet goal for this delta period>,
        "goal_seconds_text": <string: human readable coding time required to meet goal for this delta period>,
        "range": {
          "date": <string: current time range as Date string in YEAR-MONTH-DAY format (only available when delta is "day")>,
          "end": <string: end of current time range as ISO 8601 UTC datetime>,
          "start": <string: start of current time range as ISO 8601 UTC datetime>,
          "text": <string: current range in human-readable format relative to the current day>,
          "timezone": <string: timezone used in Olson Country/Region format>
        },
        "range_status": <string: either "success", "fail", "pending", or "ignored">
        "range_status_reason": <string: an explanation for why this delta period passed or failed>
      }, …
    ],
    "created_at": <string: time when this goal was created in ISO 8601 format>,
    "cumulative_status": <string: status over all delta periods, either "success", "fail", or "ignored">,
    "custom_title": <string: user defined custom title for this goal, overwrites goal title if defined>,
    "delta": <string: goal step duration; either "day" or "week">,
    "editors": <list of strings: editors for this goal>,
    "id": <string: unique id of goal>,
    "ignore_days": <list of strings: goal status set to "ignored" instead of "failed" for these weekdsays, when delta is "day">,
    "ignore_zero_days": <boolean: ignore days with no coding activity>,
    "improve_by_percent": <float: percent goal should increase each delta>,
    "is_current_user_owner": <boolean: whether the currently authenticated user is the owner of this goal>,
    "is_enabled": <boolean: whether this goal is enabled or disabled>,
    "is_inverse": <boolean: when true, the goal is to code less not more>,
    "is_snoozed": <boolean: goal email notifications are temporarily disabled until the date defined by snooze_until>,
    "is_tweeting": <boolean: this goal is setup to tweet progress each day>,
    "languages": <list of strings: languages for this goal>,
    "modified_at": <string: optional time when this goal was last changed in ISO 8601 format>,
    "owner": {
      "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
      "email": <string: email address>,
      "full_name": <string: full name of user>,
      "id": <string: unique id of user>,
      "photo": <string: url of photo for this user>,
      "username": <string: user's public username>,
    },
    "projects": <list of strings: projects for this goal>,
    "range_text": <string: complete range of this goal for all delta periods in human-readable format>,
    "seconds": <integer: goal amount>,
    "shared_with": [
      {
        "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
        "email": <string: user's email, only defined if shared via email address>,
        "full_name": <string: full name of user>,
        "id": <string: unique id of user>,
        "photo": <string: url of photo for this user>,
        "status": <string: whether this invitation has been accepted or not by the other user>,
        "user_id": <string: user's id, only defined if shared via user id>,
        "username": <string: username, only defined if shared via username>,
      }, …
    ],
    "snooze_until": <string: optional time when goal email notifications will be re-enabled, in ISO 8601 format>,
    "status": <string: most recent day or week range status; can be "success", "fail", "ignored", or "pending">,
    "status_percent_calculated": <integer: for goals which are pre-calculated in the background, the percent completed until this goal's status will be available>,
    "subscribers": [
      {
        "email": <string: email address of this subscriber, if public>,
        "email_frequency": <string: how often this subscriber receives emails about this goal>,
        "full_name": <string: name of this subscriber, if public>,
        "user_id": <string: unique id of this subscriber>,
        "username": <string: username of this subscriber, if defined>
      }, …
    ],
    "title": <string: human readable title for this goal>,
    "type": <string: type of goal>
  }
}
Goals
GET /api/v1/users/:user/goals

GET /api/v1/users/current/goals

Description
List a user’s goals.

Scope Required
read_goals

Example Response
Response Code: 200

{
  "data": [
    {
      "average_status": <string: "fail" when there are more failure days or weeks than success, otherwise "success">,
      "chart_data": [
        {
          "actual_seconds": <float: number of seconds coded during this delta period>,
          "actual_seconds_text": <string: human readable time coded during this delta period>,
          "goal_seconds": <integer: number of seconds required to meet goal for this delta period>,
          "goal_seconds_text": <string: human readable coding time required to meet goal for this delta period>,
          "range": {
            "date": <string: current time range as Date string in YEAR-MONTH-DAY format (only available when delta is "day")>,
            "end": <string: end of current time range as ISO 8601 UTC datetime>,
            "start": <string: start of current time range as ISO 8601 UTC datetime>,
            "text": <string: current range in human-readable format relative to the current day>,
            "timezone": <string: timezone used in Olson Country/Region format>
          },
          "range_status": <string: either "success", "fail", "pending", or "ignored">
          "range_status_reason": <string: an explanation for why this delta period passed or failed>
        }, …
      ],
      "created_at": <string: time when this goal was created in ISO 8601 format>,
      "cumulative_status": <string: status over all delta periods, either "success", "fail", or "ignored">,
      "custom_title": <string: user defined custom title for this goal, overwrites goal title if defined>,
      "delta": <string: goal step duration; either "day" or "week">,
      "editors": <list of strings: editors for this goal>,
      "id": <string: unique id of goal>,
      "ignore_days": <list of strings: goal status set to "ignored" instead of "failed" for these weekdsays, when delta is "day">,
      "ignore_zero_days": <boolean: ignore days with no coding activity>,
      "improve_by_percent": <float: percent goal should increase each delta>,
      "is_current_user_owner": <boolean: whether the currently authenticated user is the owner of this goal>,
      "is_enabled": <boolean: whether this goal is enabled or disabled>,
      "is_inverse": <boolean: when true, the goal is to code less not more>,
      "is_snoozed": <boolean: goal email notifications are temporarily disabled until the date defined by snooze_until>,
      "is_tweeting": <boolean: this goal is setup to tweet progress each day>,
      "languages": <list of strings: languages for this goal>,
      "modified_at": <string: optional time when this goal was last changed in ISO 8601 format>,
      "owner": {
        "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
        "email": <string: email address>,
        "full_name": <string: full name of user>,
        "id": <string: unique id of user>,
        "photo": <string: url of photo for this user>,
        "username": <string: user's public username>,
      },
      "projects": <list of strings: projects for this goal>,
      "range_text": <string: complete range of this goal for all delta periods in human-readable format>,
      "seconds": <integer: goal amount>,
      "shared_with": [
        {
          "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
          "email": <string: user's email, only defined if shared via email address>,
          "full_name": <string: full name of user>,
          "id": <string: unique id of user>,
          "photo": <string: url of photo for this user>,
          "status": <string: whether this invitation has been accepted or not by the other user>,
          "user_id": <string: user's id, only defined if shared via user id>,
          "username": <string: username, only defined if shared via username>,
        }, …
      ],
      "snooze_until": <string: optional time when goal email notifications will be re-enabled, in ISO 8601 format>,
      "status": <string: most recent day or week range status; can be "success", "fail", "ignored", or "pending">,
      "status_percent_calculated": <integer: for goals which are pre-calculated in the background, the percent completed until this goal's status will be available>,
      "subscribers": [
        {
          "email": <string: email address of this subscriber, if public>,
          "email_frequency": <string: how often this subscriber receives emails about this goal>,
          "full_name": <string: name of this subscriber, if public>,
          "user_id": <string: unique id of this subscriber>,
          "username": <string: username of this subscriber, if defined>
        }, …
      ],
      "title": <string: human readable title for this goal>,
      "type": <string: type of goal>
    }, …
  ],
  "total": <integer: number of goals>,
  "total_pages": <integer: number of pages>,
}
Try it out

Heartbeats
GET /api/v1/users/:user/heartbeats

GET /api/v1/users/current/heartbeats

Description
A user's heartbeats sent from plugins for the given day as an array.

URL Parameters
date - Date - required - Requested day; Heartbeats will be returned from 12am until 11:59pm in user's timezone for this day.

Scope Required
read_heartbeats

Example Response
Response Code: 200

{
  "data": [
    {
      "entity": <string: entity heartbeat is logging time against, such as an absolute file path or domain>,
      "type": <string: type of entity; can be file, app, or domain>,
      "category": <string: category for this activity; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, code reviewing, communicating, researching, learning, designing, or ai coding>,
      "time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
      "project": <string: project name (optional)>,
      "project_root_count": <integer: count of the number of folders in the project root path>,
      "branch": <string: branch name (optional)>,
      "language": <string: language name (optional)>,
      "dependencies": <string: optional comma separated list of dependencies detected from entity file (optional)>,
      "machine_name_id": <string: unique id of the machine which generated this coding activity>,
      "line_additions": <integer: number of lines added since last heartbeat in the current file (optional)>,
      "line_deletions": <integer: number of lines removed since last heartbeat in the current file (optional)>,
      "lines": <integer: total number of lines in the entity (when entity type is file)>,
      "lineno": <integer: current line row number of cursor (optional)>,
      "cursorpos": <integer: current cursor column position (optional)>,
      "is_write": <boolean: whether this heartbeat was triggered from writing to a file>,
    }, …
  ],
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
  "timezone": <string: timezone used for this request in Olson Country/Region format>
}
Try it out

POST /api/v1/users/:user/heartbeats

POST /api/v1/users/current/heartbeats

POST /api/v1/users/:user/heartbeats.bulk

POST /api/v1/users/current/heartbeats.bulk

Description
Creates a heartbeat representing activity for a user. The bulk endpoint accepts an array of heartbeats, limited to 25 per POST request. Editor and OS are detected from the User-Agent header. Normally you don’t need this endpoint and should use wakatime-cli to send heartbeats.

Scope Required
write_heartbeats

JSON POST Data
{
  "entity": <string: entity heartbeat is logging time against, such as an absolute file path or domain>,
  "type": <string: type of entity; can be file, app, or domain>,
  "category": <string: category for this activity (optional); normally this is inferred automatically from type; can be coding, building, indexing, debugging, browsing, running tests, writing tests, manual testing, writing docs, communicating, code reviewing, researching, learning, designing, or ai coding>,
  "time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
  "project": <string: project name (optional)>,
  "project_root_count": <integer: count of the number of folders in the project root path (optional); for ex: if the project folder is /Users/user/projects/wakatime and the entity path is /Users/user/projects/wakatime/models/user.py then the project_root_count is 5 and the relative entity path after removing 5 prefix folders is models/user.py>,
  "branch": <string: branch name (optional)>,
  "language": <string: language name (optional)>,
  "dependencies": <string: comma separated list of dependencies detected from entity file (optional)>,
  "lines": <integer: total number of lines in the entity (when entity type is file)>,
  "line_additions": <integer: number of lines added since last heartbeat in the current file (optional)>,
  "line_deletions": <integer: number of lines removed since last heartbeat in the current file (optional)>,
  "lineno": <integer: current line row number of cursor with the first line starting at 1 (optional)>,
  "cursorpos": <integer: current cursor column position starting from 1 (optional)>,
  "is_write": <boolean: whether this heartbeat was triggered from writing to a file (optional)>,
}
Example Response
Response Code: 202

{
  "data": {
    "id": <string: unique id of newly created heartbeat>,
    "entity": <string: entity heartbeat is logging time against, such as an absolute file path or domain>,
    "type": <string: type of entity; can be file, app, or domain>,
    "time": <float: UNIX epoch timestamp; numbers after decimal point are fractions of a second>,
  }
}
DELETE /api/v1/users/:user/heartbeats.bulk

DELETE /api/v1/users/current/heartbeats.bulk

Description
Permanently deletes heartbeats, removing the deleted code stats from all dashboards. Used by the Code Delete Tool.

Scope Required
write_heartbeats

JSON POST Data
{
  "date": <string: A date in format YYYY-MM-DD. Heartbeats will only be deleted for the given date from 12am until 11:59pm in user's timezone>,
  "ids": <list: A list of string Heartbeat IDs to delete.>,
}
Example Response
Response Code: 200

{
  "data": {}
}
Insights
GET /api/v1/users/:user/insights/:insight_type/:range

GET /api/v1/users/current/insights/:insight_type/:range

Description
An insight about the user’s coding activity for the given time range. insight_type can be one of weekday, days, best_day, daily_average, projects, languages, editors, categories, machines, or operating_systems. range can be a YYYY year, YYYY-MM month or one of last_7_days, last_30_days, last_6_months, last_year, or all_time. For accounts subscribed to the free plan, time ranges >= one year are updated on the first request. It’s best to always check is_up_to_date and retry your request when the response is stale.

URL Parameters
timeout - Integer - optional - The keystroke timeout value used to calculate these stats. Defaults the the user's keystroke timeout value.

writes_only - Boolean - optional - The writes_only value used to calculate these stats. Defaults to the user's writes_only setting.

weekday - Integer - optional - Filter days to only the given weekday. Only works with days insight. Can be an integer 0-6 or corresponding string monday-sunday.

Scope Required
read_summaries

Example Response
Response Code: 200

{
  "data": {
    "<insight_type>": <object or array: data for this insight type over the given time range>,
    "range": <string: time range of these stats>,
    "human_readable_range": <string: time range as human readable string>,
    "status": <string: status of these stats in the cache>,
    "is_including_today": <boolean: true if these stats include the current day; normally false except range "all_time">,
    "is_up_to_date": <boolean: true if these stats are up to date; when false, stats are missing or from an old time range and will be refreshed soon>,
    "percent_calculated": <integer: percent these stats have finished updating in the background>,
    "start": <string: start of this time range as ISO 8601 UTC datetime>,
    "end": <string: end of this time range as ISO 8601 UTC datetime>,
    "timezone": <string: timezone used in Olson Country/Region format>,
    "timeout": <integer: value of the user's keystroke timeout setting in minutes>,
    "writes_only": <boolean: status of the user's writes_only setting>,
    "user_id": <string: unique id of this user>,
    "created_at": <string: time when these stats were created in ISO 8601 format>,
    "modified_at": <string: time when these stats were last updated in ISO 8601 format>
  }
}
Try it out

Leaders
GET /api/v1/leaders

Description
List of users ranked by coding activity in descending order. Same as the public leaderboards. The public leaderboard updates at least once every 12 hours, and usually more frequently.

URL Parameters
language - String - optional - Filter leaders by a specific language.

is_hireable - Boolean - optional - Filter leaders by the hireable badge.

country_code - String - optional - Filter leaders by two-character country code.

page - Integer - optional - Page number of leaderboard. If authenticated, defaults to the page containing the currently authenticated user.

Example Response
Response Code: 200

{
  "current_user": {
    "rank": <integer: rank of the currently authorized user, or null if the current user is not on this leader board>,
    "page": <integer: page containing the currently authorized user, or null if the current user is not on this leader board>,
    "user": {
      "id": <string: unique id of user>,
      "email": <string: email address of user, if public>,
      "username": <string: users public username>,
      "full_name": <string: full name of user>,
      "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
      "website": <string: website of user>,
      "human_readable_website": <string: website of user without url scheme>,
      "is_hireable": <boolean: represents the “hireable” badge on user profiles>,
      "city": {
        "country_code": <string: two letter code, for ex: US or UK>,
        "name": <string: city name, for ex: San Francisco>,
        "state": <string: state name, for ex: California>,
        "title": <string: city, state (or country if state has same name as city)>
      },
      "is_email_public": <boolean: whether this user's email should be shown publicly on leader boards>,
      "photo_public": <boolean: whether this user's photo should be shown publicly on leader boards>,
    },
  },
  "data": [
    {
      "rank": <integer: rank of this leader>,
      "running_total": {
        "total_seconds": <float: total coding activity for this user as seconds>,
        "human_readable_total": <string: total coding activity for this user as human readable string>,
        "daily_average": <float: daily average for this user as seconds>,
        "human_readable_daily_average": <string: daily average for this user as human readable string>,
        "languages": [
          {
            "name": <string: language name>,
            "total_seconds": <float: total seconds user has logged in this language>,
          }, …
        ],
      },
      "user": {
        "id": <string: unique id of user>,
        "email": <string: email address of user, if public>,
        "username": <string: users public username>,
        "full_name": <string: full name of user>,
        "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
        "website": <string: website of user>,
        "human_readable_website": <string: website of user without url scheme>,
        "city": {
          "country_code": <string: two letter code, for ex: US or UK>,
          "name": <string: city name, for ex: San Francisco>,
          "state": <string: state name, for ex: California>,
          "title": <string: city, state (or country if state has same name as city)>
        },
        "is_email_public": <boolean: whether this user's email should be shown publicly on leader boards>,
        "photo_public": <boolean: whether this user's photo should be shown publicly on leader boards>,
      },
    }, …
  ],
  "page": <integer: current page number>
  "total_pages": <integer: number of pages available>,
  "range": {
    "start_date": <string: start of this range as ISO 8601 UTC datetime>,
    "start_text": <string: start of range in human-readable format relative to the current day>,
    "end_date": <string: end of range as ISO 8601 UTC datetime>,
    "end_text": <string: end of range in human-readable format relative to the current day>,
    "name": <string: time range of this leaderboard>,
    "text": <string: time range in human-readable format relative to the current day>,
  }
  "language": <string: language filter for this leaderboard>,
  "is_hireable": <boolean: hireable filter for this leaderboard>,
  "country_code": <string: country code filter for this leaderboard>,
  "modified_at": <string: time when this leaderboard was last updated in ISO 8601 format>
  "timeout": <integer: keystroke timeout setting in minutes used by this leaderboard>,
  "writes_only": <boolean: writes_only setting used by this leaderboard>,
}
Try it out

Machine Names
GET /api/v1/users/:user/machine_names

GET /api/v1/users/current/machine_names

Description
List of machines for this user.

Scope Required
read_stats.machines

Example Response
Response Code: 200

{
  "data": {
    "id": <string: unique id of this machine>,
    "name": <string: the machine’s name, normally the host name; when user’s preference is to show IPs in machine names, this will include the IP address of the machine.>,
    "value": <string: local host name of this machine>,
    "ip": <string: ip address of this machine>,
    "last_seen_at": <string: time when this machine was last seen in ISO 8601 format>,
    "timezone": <string: timezone sent with first heartbeat received for this machine, in Olson Country/Region format>,
    "created_at": <string: time when this machine was first seen in ISO 8601 format>,
  },
}
Try it out

Meta
GET /api/v1/meta

Description
Information about WakaTime, such as a list of public ip addresses used by WakaTime servers.

Example Response
Response Code: 200

{
  "data": {
    "ip_descriptions": <object: explanation of each ip category (api, website, worker)>,
    "ips": {
      "api": <list of strings: ip addresses used by WakaTime api servers>,
      "website": <list of strings: ip addresses used by WakaTime website servers>,
      "worker": <list of strings: ip addresses used by WakaTime background worker servers>
    },
    "last_modified_at": <string: last time an IP was either added, removed, or modified in ISO 8601 format; use similar to etag, to sync your firewall configs only when IPs have changed>
  },
}
Try it out

Org Custom Rules
GET /api/v1/users/:user/orgs/:org/custom_rules

GET /api/v1/users/current/orgs/:org/custom_rules

Description
List of custom rules for this org.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "action": <string: either "change" or "delete">,
      "source": <string: the heartbeat property to match against source_value>,
      "operation": <string: one of "equals", "contains", "starts with", or "ends with">,
      "source_value": <string: the match string>,
      "destination": <string: the heartbeat property to replace with destination_value>,
      "destination_value": <string: the replacement string>,
      "priority": <integer: a unique number determining the order this rule is executed on heartbeats; starts with 1; lower priorities are executed before higher priorities>,
    }, …
  ],
}
PUT /api/v1/users/:user/orgs/:org/custom_rules

PUT /api/v1/users/current/orgs/:org/custom_rules

Description
Updates an org’s custom rules. Accepts an array of rules and merges them with all team member custom rules.

Scope Required
write_orgs

JSON POST Data
[
  {
    "action": <string: either "change" or "delete">,
    "source": <string: the heartbeat property to match against source_value>,
    "operation": <string: one of "equals", "contains", "starts with", or "ends with">,
    "source_value": <string: the match string>,
    "destination": <string: the heartbeat property to replace with destination_value>,
    "destination_value": <string: the replacement string>,
    "priority": <integer: a unique number determining the order this rule is executed on heartbeats; starts with 1; lower priorities are executed before higher priorities>,
  }, …
]
Example Response
Response Code: 200

{
  "data": {
    "changes": {
      "added": [],
      "removed": [],
      "rearranged": [],
    }
  }
}
Org Dashboard Durations
GET /api/v1/users/:user/orgs/:org/dashboards/:dashboard/durations

GET /api/v1/users/current/orgs/:orgs/dashboards/:dashboard/durations

Description
A dashboard's coding activity for the given day as an array of durations for each dashboard dev.

URL Parameters
date - Date - required - Date in YYYY-MM-DD format.

project - String - optional - Only show durations for this project.

branches - String - optional - Only show durations for these branches; comma separated list of branch names.

slice_by - String - optional - Optional primary key to use when slicing durations. Defaults to “project”. Can be “project”, “entity”, “language”, “dependencies”, “os”, “editor”, “category”, or “machine”.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "start": <string: start of time range as ISO 8601 UTC datetime>,
      "end": <string: end of time range as ISO 8601 UTC datetime>,
      "timezone": <string: timezone used for this member’s durations in Olson Country/Region format>
      "member": {
        "id": <string: unique id of user>,
        "email": <string: email address>,
        "full_name": <string: full name of user>,
        "photo": <string: url of photo for this user>,
        "username": <string: users public username>,
        "default_personal_privacy": <string: the dev’s default personal project privacy setting, either visible or hidden>,
      },
      "durations": {
        "project": <string: project name>,
        "time": <float: start of this duration as ISO 8601 UTC datetime; numbers after decimal point are fractions of a second>,
        "duration": <float: length of time of this duration in seconds>
      }, …
    }, …
  ],
}
Org Dashboard Member Durations
GET /api/v1/users/:user/orgs/:org/dashboards/:dashboard/members/:member/durations

GET /api/v1/users/current/orgs/:orgs/dashboards/:dashboard/members/:member/durations

Description
A dashboard member's coding activity for the given day as an array of durations.

URL Parameters
date - Date - required - Date in YYYY-MM-DD format.

project - String - optional - Only show durations for this project.

branches - String - optional - Only show durations for these branches; comma separated list of branch names.

slice_by - String - optional - Optional primary key to use when slicing durations. Defaults to “project”. Can be “project”, “entity”, “language”, “dependencies”, “os”, “editor”, “category”, or “machine”.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "project": <string: project name>,
      "time": <float: start of this duration as ISO 8601 UTC datetime; numbers after decimal point are fractions of a second>,
      "duration": <float: length of time of this duration in seconds>
    }, …
  ],
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
  "timezone": <string: timezone used for this request in Olson Country/Region format>
}
Org Dashboard Member Summaries
GET /api/v1/users/:user/orgs/:org/dashboards/:dashboard/members/:member/summaries

GET /api/v1/users/current/orgs/:org/dashboards/:dashboard/members/:member/summaries

Description
An organization dashboard member’s coding activity for the given time range as an array of summaries segmented by day.

URL Parameters
start - Date - required - Start date of the time range.

end - Date - required - End date of the time range.

project - String - optional - Only show time logged to this project.

branches - String - optional - Only show coding activity for these branches; comma separated list of branch names.

range - String - optional - Alternative way to supply start and end dates. Can be one of “Today”, “Yesterday”, “Last 7 Days”, “Last 7 Days from Yesterday”, “Last 14 Days”, “Last 30 Days”, “This Week”, “Last Week”, “This Month”, or “Last Month”.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "grand_total": {
        "digital": <string: total coding activity in digital clock format>,
        "hours": <integer: hours portion of coding activity>,
        "minutes": <integer: minutes portion of coding activity>,
        "text": <string: total coding activity in human readable format>,
        "total_seconds": <float: total coding activity as seconds>
      },
      "projects": [
        {
          "name": <string: project name>,
          "total_seconds": <float: total coding activity as seconds>,
          "percent": <float: percent of time spent in this project>,
          "digital": <string: total coding activity for this project in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this project>,
          "minutes": <integer: minutes portion of coding activity for this project>
        }, …
      ],
      "languages": [
        {
          "name": <string: language name>,
          "total_seconds": <float: total coding activity spent in this language as seconds>,
          "percent": <float: percent of time spent in this language>,
          "digital": <string: total coding activity for this language in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this language>,
          "minutes": <integer: minutes portion of coding activity for this language>,
          "seconds": <integer: seconds portion of coding activity for this language>
        }, …
      ],
      "editors": [
        {
          "name": <string: editor name>,
          "total_seconds": <float: total coding activity spent in this editor as seconds>,
          "percent": <float: percent of time spent in this editor>,
          "digital": <string: total coding activity for this editor in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this editor>,
          "minutes": <integer: minutes portion of coding activity for this editor>,
          "seconds": <integer: seconds portion of coding activity for this editor>
        }, …
      ],
      "operating_systems": [
        {
          "name": <string: os name>,
          "total_seconds": <float: total coding activity spent in this os as seconds>,
          "percent": <float: percent of time spent in this os>,
          "digital": <string: total coding activity for this os in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this os>,
          "minutes": <integer: minutes portion of coding activity for this os>,
          "seconds": <integer: seconds portion of coding activity for this os>
        }, …
      ],
      "branches": [ // included only when project url parameter used
        {
          "name": <string: branch name>,
          "total_seconds": <float: total coding activity spent in this branch as seconds>,
          "percent": <float: percent of time spent in this branch>,
          "digital": <string: total coding activity for this branch in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this branch>,
          "minutes": <integer: minutes portion of coding activity for this branch>,
          "seconds": <integer: seconds portion of coding activity for this branch>
        }, …
      ],
      "entities": [ // included only when project url parameter used
        {
          "name": <string: entity name>,
          "total_seconds": <float: total coding activity spent in this entity as seconds>,
          "percent": <float: percent of time spent in this entity>,
          "digital": <string: total coding activity for this entity in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this entity>,
          "minutes": <integer: minutes portion of coding activity for this entity>,
          "seconds": <integer: seconds portion of coding activity for this entity>
        }, …
      ],
      "range": {
        "date": <string: this day as Date string in YEAR-MONTH-DAY format>,
        "start": <string: start of this day as ISO 8601 UTC datetime>,
        "end": <string: end of this day as ISO 8601 UTC datetime>,
        "text": <string: this day in human-readable format relative to the current day>,
        "timezone": <string: timezone used in Olson Country/Region format>
      }
    }, …
  ],
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
  "default_personal_privacy": <string: the dev’s default personal project privacy setting, either visible or hidden>,
  "cumulative_total": {
    "seconds": <float: cumulative number of seconds over the date range of summaries>,
    "text": <string: cumulative total coding activity in human readable format>,
  },
  "daily_average": {
    "holidays": <integer: number of days in this range with no coding time logged>,
    "days_including_holidays": <integer: number of days in this range>,
    "days_minus_holidays": <integer: number of days in this range excluding days with no activity>,
    "seconds": <float: average coding activity per day as seconds for the given range of time, excluding Other language>,
    "text": <string: daily average, excluding Other language, as human readable string>,
    "seconds_including_other_language": <float: average coding activity per day as seconds for the given range of time>,
    "text_including_other_language": <string: daily average as human readable string>,
  },
}
Org Dashboard Members
GET /api/v1/users/:user/orgs/:org/dashboards/:dashboard/members

GET /api/v1/users/current/orgs/:org/dashboards/:dashboard/members

Description
List an organization’s members.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of user>,
      "email": <string: email address>,
      "full_name": <string: full name of user>,
      "is_view_only": <boolean: when true, this member’s coding activity is hidden from the dashboard>,
      "photo": <string: url of photo for this user>,
      "username": <string: users public username>,
    }, …
  ],
  "next_page": <integer: the next page number, if available>,
  "page": <integer: the current page number>,
  "prev_page": <integer: the previous page number, if available>,
  "total": <integer: total number of dashboard members>,
  "total_pages": <integer: number of pages available>,
}
Org Dashboard Summaries
GET /api/v1/users/:user/orgs/:org/dashboards/:dashboard/summaries

GET /api/v1/users/current/orgs/:org/dashboards/:dashboard/summaries

Description
An organization dashboard’s coding activity for the given day as an array of summaries for each dashboard dev.

URL Parameters
date - Date - required - Date in YYYY-MM-DD format.

project - String - optional - Only show time logged to this project.

branches - String - optional - Only show coding activity for these branches; comma separated list of branch names.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "grand_total": {
        "digital": <string: total coding activity in digital clock format>,
        "hours": <integer: hours portion of coding activity>,
        "minutes": <integer: minutes portion of coding activity>,
        "text": <string: total coding activity in human readable format>,
        "total_seconds": <float: total coding activity as seconds>
      },
      "projects": [
        {
          "name": <string: project name>,
          "total_seconds": <float: total coding activity as seconds>,
          "percent": <float: percent of time spent in this project>,
          "digital": <string: total coding activity for this project in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this project>,
          "minutes": <integer: minutes portion of coding activity for this project>
        }, …
      ],
      "languages": [
        {
          "name": <string: language name>,
          "total_seconds": <float: total coding activity spent in this language as seconds>,
          "percent": <float: percent of time spent in this language>,
          "digital": <string: total coding activity for this language in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this language>,
          "minutes": <integer: minutes portion of coding activity for this language>,
          "seconds": <integer: seconds portion of coding activity for this language>
        }, …
      ],
      "editors": [
        {
          "name": <string: editor name>,
          "total_seconds": <float: total coding activity spent in this editor as seconds>,
          "percent": <float: percent of time spent in this editor>,
          "digital": <string: total coding activity for this editor in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this editor>,
          "minutes": <integer: minutes portion of coding activity for this editor>,
          "seconds": <integer: seconds portion of coding activity for this editor>
        }, …
      ],
      "operating_systems": [
        {
          "name": <string: os name>,
          "total_seconds": <float: total coding activity spent in this os as seconds>,
          "percent": <float: percent of time spent in this os>,
          "digital": <string: total coding activity for this os in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this os>,
          "minutes": <integer: minutes portion of coding activity for this os>,
          "seconds": <integer: seconds portion of coding activity for this os>
        }, …
      ],
      "branches": [ // included only when project url parameter used
        {
          "name": <string: branch name>,
          "total_seconds": <float: total coding activity spent in this branch as seconds>,
          "percent": <float: percent of time spent in this branch>,
          "digital": <string: total coding activity for this branch in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this branch>,
          "minutes": <integer: minutes portion of coding activity for this branch>,
          "seconds": <integer: seconds portion of coding activity for this branch>
        }, …
      ],
      "entities": [ // included only when project url parameter used
        {
          "name": <string: entity name>,
          "total_seconds": <float: total coding activity spent in this entity as seconds>,
          "percent": <float: percent of time spent in this entity>,
          "digital": <string: total coding activity for this entity in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this entity>,
          "minutes": <integer: minutes portion of coding activity for this entity>,
          "seconds": <integer: seconds portion of coding activity for this entity>
        }, …
      ],
      "range": {
        "date": <string: this day as Date string in YEAR-MONTH-DAY format>,
        "start": <string: start of this day as ISO 8601 UTC datetime>,
        "end": <string: end of this day as ISO 8601 UTC datetime>,
        "text": <string: this day in human-readable format relative to the current day>,
        "timezone": <string: timezone used in Olson Country/Region format>
      },
      "member": {
        "id": <string: unique id of user>,
        "email": <string: email address>,
        "full_name": <string: full name of user>,
        "photo": <string: url of photo for this user>,
        "username": <string: users public username>,
        "default_personal_privacy": <string: the dev’s default personal project privacy setting, either visible or hidden>,
      },
    }, …
  ],
  "cumulative_total": {
    "seconds": <float: cumulative number of seconds for all devs for this day>,
    "text": <string: cumulative total coding activity in human readable format>,
  },
}
Org Dashboards
GET /api/v1/users/:user/orgs/:org/dashboards

GET /api/v1/users/current/orgs/:org/dashboards

Description
List the organization’s dashboards.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of this dashboard>,
      "full_name": <string: this dashboard’s name>,
      "created_by": <string: name of user who created this dashboard>,
      "timezone": <string: the dashboard's timezone in Olson Country/Region format; defaults to the organization’s timezone>,
      "has_changed_timezone": <boolean: whether this dashboard’s timezone is different from the organization’s timezone preference>,
      "members_count": <integer: total number of members in this dashboard>,
      "members_count_human_readable": <string: number of members in this dashboard as string>,
      "is_current_user_member": <boolean: whether the currently authenticated user is a member of this dashboard>,
      "is_viewing_restricted": <boolean: whether reading this dashboard is restricted to an allowed list of members>,
      "is_manual_time_hidden": <boolean: whether this dashboard has manual time entries hidden>,
      "can_current_user_view": <boolean: whether the currently authenticated user can view this dashboard>,
      "can_current_user_request_to_view": <boolean: whether the currently authenticated user can request to view this dashboard>,
      "can_current_user_request_to_join": <boolean: whether the currently authenticated user can request to join this dashboard>,
      "can_current_user_add_members": <boolean: whether the currently authenticated user can add members to this dashboard>,
      "can_current_user_remove_members": <boolean: whether the currently authenticated user can remove members from this dashboard>,
      "can_current_user_delete": <boolean: whether the currently authenticated user can delete this dashboard>,
      "created_at": <string: time when user was created in ISO 8601 format>,
      "modified_at": <string: time when user was last modified in ISO 8601 format>,
    }, …
  ],
  "next_page": <integer: the next page number, if available>,
  "page": <integer: the current page number>,
  "prev_page": <integer: the previous page number, if available>,
  "total": <integer: total number of dashboards in this org>,
  "total_pages": <integer: number of pages available>,
}
Orgs
GET /api/v1/users/:user/orgs

GET /api/v1/users/current/orgs

Description
List a user’s organizations.

Scope Required
read_orgs

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique id of org>,
      "name": <string: the org’s name.>,
      "default_project_privacy": <string: the user’s default privacy for projects on dashboards; can be "visible" or "hidden">,
      "invited_people_count": <integer: number of pending invites>,
      "invited_people_count_human_readable": <string: number of pending invites as string>,
      "is_duration_visible": <boolean: when true, people in this org can see each other’s durations coding activity>,
      "people_count": <integer: number of people in this org>,
      "people_count_human_readable": <string: number of people in this org as string>,
      "timeout": <integer: this organization’s keystroke timeout preference>,
      "timezone": <integer: this organization’s timezone preference>,
      "writes_only": <integer: this organization’s writes-only preference>
      "can_current_user_list_dashboards": <boolean: whether the currently authenticated user can list dashboards>,
      "can_current_user_create_dashboards": <boolean: whether the currently authenticated user can create dashboards>,
      "can_current_user_display_coding_on_dashboards": <boolean: whether the currently authenticated user can display their coding activity on dashboards>,
      "can_current_user_view_all_dashboards": <boolean: whether the currently authenticated user can view dashboards in this org without first being invited>,
      "can_current_user_add_people_to_dashboards": <boolean: whether the currently authenticated user can add people to dashboards>,
      "can_current_user_remove_people_from_dashboards": <boolean: whether the currently authenticated user can remove people from dashboards>,
      "can_current_user_edit_and_delete_dashboards": <boolean: whether the currently authenticated user can edit and delete dashboards>,
      "can_current_user_add_people_to_org": <boolean: whether the currently authenticated user can add people to this org>,
      "can_current_user_remove_people_from_org": <boolean: whether the currently authenticated user can remove people from this org>,
      "can_current_user_manage_groups": <boolean: whether the currently authenticated user can add, manage, and delete groups and permissions>,
      "can_current_user_view_audit_log": <boolean: whether the currently authenticated user can view the org’s audit log>,
      "can_current_user_edit_org": <boolean: whether the currently authenticated user can edit this org’s preferences>,
      "can_current_user_manage_billing": <boolean: whether the currently authenticated user can manage this org’s billing>,
      "can_current_user_delete_org": <boolean: whether the currently authenticated user can delete this org>,
      "created_at": <string: time when user was created in ISO 8601 format>,
      "modified_at": <string: time when user was last modified in ISO 8601 format>,
    }, …
  ],
  "next_page": <integer: the next page number, if available>,
  "page": <integer: the current page number>,
  "prev_page": <integer: the previous page number, if available>,
  "total": <integer: total number of orgs>,
  "total_pages": <integer: number of pages available>,
}
Try it out

Private Leaderboards
GET /api/v1/users/:user/leaderboards

GET /api/v1/users/current/leaderboards

Description
List user’s private leaderboards. Same as this page.

Scope Required
read_private_leaderboards

Example Response
Response Code: 200

{
  "data": [
    {
      "can_delete": <boolean: true if user has access to delete this leaderboard>,
      "can_edit": <boolean: true if user has access to edit this leaderboard>,
      "created_at": <string: time when leaderboard was created in ISO 8601 format>,
      "has_available_seat": <boolean: true if this leaderboard has room for more members>,
      "id": <string: unique id of leaderboard>,
      "members_count": <int: number of members in this private leaderboard>,
      "members_with_timezones_count": <int: number of members who have timezones set; when a user does not have a timezone, they will be hidden from leaderboards>,
      "modified_at": <string: time when leaderboard was last modified in ISO 8601 format>,
      "name": <string: display name>,
      "time_range": <string: time range of this leaderboard; always "last_7_days">,
    }, …
  ],
  "total": <integer: total number of private leaderboards>,
  "total_pages": <integer: number of pages available>,
}
Try it out

Private Leaderboards Leaders
GET /api/v1/users/:user/leaderboards/:board

GET /api/v1/users/current/leaderboards/:board

Description
List of users in this private leaderboard ranked by coding activity in descending order.

URL Parameters
language - String - optional - Filter leaders by a specific language.

country_code - String - optional - Filter leaders by two-character country code.

page - Integer - optional - Page number of leaderboard. If authenticated, defaults to the page containing the currently authenticated user.

Scope Required
read_private_leaderboards

Example Response
Response Code: 200

{
  "data": [
    {
      "rank": <int: rank of this leaderboard member>,
      "page": <integer: page containing the currently authorized user>,
      "user": {
        "id": <string: unique id of user>,
        "email": <string: email address of user, if public>,
        "username": <string: users public username>,
        "full_name": <string: full name of user>,
        "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
        "website": <string: website of user>,
        "human_readable_website": <string: website of user without url scheme>,
        "is_hireable": <boolean: represents the “hireable” badge on user profiles>,
        "city": {
          "country_code": <string: two letter code, for ex: US or UK>,
          "name": <string: city name, for ex: San Francisco>,
          "state": <string: state name, for ex: California>,
          "title": <string: city, state (or country if state has same name as city)>
        },
        "is_email_public": <boolean: whether this user's email should be shown publicly on leader boards>,
        "photo_public": <boolean: whether this user's photo should be shown publicly on leader boards>,
      },
    }, …
  ],
  "language": <string: language filter for this leaderboard>,
  "country_code": <string: country code filter for this leaderboard>,
  "modified_at": <string: time when leaderboard was last modified in ISO 8601 format>,
  "page": <int: current page>,
  "total_pages": <integer: number of pages available>,
  "range": {
    "start_date": <string: start of this range as ISO 8601 UTC datetime>,
    "start_text": <string: start of range in human-readable format relative to the current day>,
    "end_date": <string: end of range as ISO 8601 UTC datetime>,
    "end_text": <string: end of range in human-readable format relative to the current day>,
    "name": <string: time range of this leaderboard>,
    "text": <string: time range in human-readable format relative to the current day>,
  }
  "timeout": <integer: keystroke timeout setting in minutes used by this leaderboard>,
  "total_pages": <integer: number of pages available>,
  "writes_only": <boolean: writes_only setting used by this leaderboard>,
}
Program Languages
GET /api/v1/program_languages

Description
List of all verified program languages supported by WakaTime.

Example Response
Response Code: 200

{
  "data": [
    "id": <string: unique id of this language>,
    "name": <string: human readable name of this language>
    "color": <string: hex color code, used when displaying this language on WakaTime charts>,
    "is_verified": <boolean: whether this language is verified, by GitHub’s linguist or manually by WakaTime admins>,
    "created_at": <string: time when this language was created in ISO 8601 format>,
    "modified_at": <string: time when this language was last modified in ISO 8601 format>
  ], …
  "total": <integer: number of program languages>,
  "total_pages": <integer: number of pages>,
}
Try it out

Projects
GET /api/v1/users/:user/projects

GET /api/v1/users/current/projects

Description
List of WakaTime projects for the current user.

URL Parameters
q - String - optional - Filter project names by a search term.

Scope Required
read_stats.projects

Example Response
Response Code: 200

{
  "data": [
    {
      "id": <string: unique project id>,
      "name": <string: project name>,
      "repository": <string: associated repository if connected>,
      "badge": <string: associated project badge if enabled>,
      "color": <string: custom project color as hex string, or null if using default color>,
      "clients": <list: clients associated with this project>,
      "has_public_url": <boolean: whether this project has a shareable url defined>,
      "human_readable_last_heartbeat_at": <string: time when project last received code stats as human readable string>,
      "last_heartbeat_at": <string: time when project last received code stats in ISO 8601 format>,
      "human_readable_first_heartbeat_at": <string: time when project first received code stats as human readable string; currently only set for users who signed up after 2024-02-05T00:00:00Z UTC>,
      "first_heartbeat_at": <string: time when project first received code stats in ISO 8601 format; currently only set for users who signed up after 2024-02-05T00:00:00Z UTC>,
      "url": <string: url of this project relative to wakatime.com>,
      "urlencoded_name": <string: project name url entity encoded>,
      "created_at": <string: time when project was created in ISO 8601 format>,
    }, …
  ],
}
Try it out

Stats
GET /api/v1/users/:user/stats

GET /api/v1/users/current/stats

GET /api/v1/users/:user/stats/:range

GET /api/v1/users/current/stats/:range

Description
A user's coding activity for the given time range. Optional range can be a YYYY year, YYYY-MM month, or one of last_7_days, last_30_days, last_6_months, last_year, or all_time. When range isn’t present, the user’s public profile range is used. For accounts subscribed to the free plan, time ranges >= one year are updated on the first request. It’s best to always check is_up_to_date and retry your request when the response is stale. Stats are read-only representations of Heartbeats, Durations, and Summaries, created by joining multiple Heartbeats together when they’re within 15 minutes of each other. The 15 minutes default can be changed with your account’s Keystroke Timeout preference.

URL Parameters
timeout - Integer - optional - The keystroke timeout value used to calculate these stats. Defaults the the user's keystroke timeout value.

writes_only - Boolean - optional - The writes_only value used to calculate these stats. Defaults to the user's writes_only setting.

Scope Required
read_stats

Example Response
Response Code: 200

{
  "data": {
    "total_seconds": <float: total coding activity, excluding "Other" language, as seconds for the given range of time>,
    "total_seconds_including_other_language": <float: total coding activity as seconds for the given range of time>,
    "human_readable_total": <string: total coding activity, excluding "Other" language, as human readable string>,
    "human_readable_total_including_other_language": <string: total coding activity as human readable string>,
    "daily_average": <float: average coding activity per day as seconds for the given range of time, excluding Other language>,
    "daily_average_including_other_language": <float: average coding activity per day as seconds for the given range of time>,
    "human_readable_daily_average": <string: daily average as human readable string, excluding Other language>,
    "human_readable_daily_average_including_other_language": <string: daily average as human readable string>,
    "categories": [
      {
        "name": <string: name of category, for ex: Coding or Debugging>,
        "total_seconds": <float: total coding activity as seconds>,
        "percent": <float: percent of time spent in this category>,
        "digital": <string: total coding activity for this category in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this category>,
        "minutes": <integer: minutes portion of coding activity for this category>
      }, …
    ],
    "projects": [
      {
        "name": <string: project name>,
        "total_seconds": <float: total coding activity as seconds>,
        "percent": <float: percent of time spent in this project>,
        "digital": <string: total coding activity for this project in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this project>,
        "minutes": <integer: minutes portion of coding activity for this project>
      }, …
    ],
    "languages": [
      {
        "name": <string: language name>,
        "total_seconds": <float: total coding activity spent in this language as seconds>,
        "percent": <float: percent of time spent in this language>,
        "digital": <string: total coding activity for this language in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this language>,
        "minutes": <integer: minutes portion of coding activity for this language>,
        "seconds": <integer: seconds portion of coding activity for this language>
      }, …
    ],
    "editors": [
      {
        "name": <string: editor name>,
        "total_seconds": <float: total coding activity spent in this editor as seconds>,
        "percent": <float: percent of time spent in this editor>,
        "digital": <string: total coding activity for this editor in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this editor>,
        "minutes": <integer: minutes portion of coding activity for this editor>,
        "seconds": <integer: seconds portion of coding activity for this editor>
      }, …
    ],
    "operating_systems": [
      {
        "name": <string: os name>,
        "total_seconds": <float: total coding activity spent in this os as seconds>,
        "percent": <float: percent of time spent in this os>,
        "digital": <string: total coding activity for this os in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this os>,
        "minutes": <integer: minutes portion of coding activity for this os>,
        "seconds": <integer: seconds portion of coding activity for this os>
      }, …
    ],
    "dependencies": [
      {
        "name": <string: dependency name>,
        "total_seconds": <float: total coding activity spent in this dependency as seconds>,
        "percent": <float: percent of time spent in this dependency>,
        "digital": <string: total coding activity for this dependency in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this dependency>,
        "minutes": <integer: minutes portion of coding activity for this dependency>,
        "seconds": <integer: seconds portion of coding activity for this dependency>
      }, …
    ],
    "machines": [
      {
        "name": <string: machine hostname and ip address>,
        "machine_name_id": <string: unique id of this machine>,
        "total_seconds": <float: total coding activity spent on this machine as seconds>,
        "percent": <float: percent of time spent on this machine>,
        "digital": <string: total coding activity for this machine in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this machine>,
        "minutes": <integer: minutes portion of coding activity for this machine>,
        "seconds": <integer: seconds portion of coding activity for this machine>
      }, …
    ],
    "best_day": {
      "date": <string: day with most coding time logged as Date string in YEAR-MONTH-DAY format>,
      "text": <string: total coding activity for this day in human readable format>,
      "total_seconds": <float: number of seconds of coding activity, including other language, for this day>
    },
    "range": <string: time range of these stats>,
    "human_readable_range": <string: time range as human readable string>,
    "holidays": <integer: number of days in this range with no coding time logged>,
    "days_including_holidays": <integer: number of days in this range>,
    "days_minus_holidays": <integer: number of days in this range excluding days with no coding time logged>,
    "status": <string: status of these stats in the cache>,
    "percent_calculated": <integer: percent these stats have finished updating in the background>,
    "is_already_updating": <boolean: true if these stats are being updated in the background>,
    "is_coding_activity_visible": <boolean: true if this user's coding activity is publicly visible>,
    "is_language_usage_visible": <boolean: true if this user's language stats are publicly visible>,
    "is_editor_usage_visible": <boolean: true if this user's editor stats are publicly visible>,
    "is_category_usage_visible": <boolean: true if this user's category stats are publicly visible>,
    "is_os_usage_visible": <boolean: true if this user's operating system stats are publicly visible>,
    "is_stuck": <boolean: true if these stats got stuck while processing and will be recalculated in the background>,
    "is_including_today": <boolean: true if these stats include the current day; normally false except range "all_time">,
    "is_up_to_date": <boolean: true if these stats are up to date; when false, stats are missing or from an old time range and will be refreshed soon>,
    "start": <string: start of this time range as ISO 8601 UTC datetime>,
    "end": <string: end of this time range as ISO 8601 UTC datetime>,
    "timezone": <string: timezone used in Olson Country/Region format>,
    "timeout": <integer: value of the user's keystroke timeout setting in minutes>,
    "writes_only": <boolean: status of the user's writes_only setting>,
    "user_id": <string: unique id of this user>,
    "username": <string: public username for this user>,
    "created_at": <string: time when these stats were created in ISO 8601 format>,
    "modified_at": <string: time when these stats were last updated in ISO 8601 format>
  }
}
Try it out

Stats Aggregated
GET /api/v1/stats/:range

Description
Aggregate stats of all WakaTime users over the given time range. range can be one of last_7_days or any year in the past since 2013 for ex: 2020. Aggregate stats are only available with the same preferences as public profiles (Default 15m keystroke timeout preference). Yearly aggregate stats are calculated each year on Jan 1st.

Example Response
Response Code: 200

{
  "data": {
    "categories": [
      {
        "name": <string: name of this category, for ex: Coding or Debugging>,
        "is_verified": <boolean: whether the category of activity is verified or unverified>,
        "average": {
          "seconds": <float: average number of seconds coded by all WakaTime users in this category>,
          "text": <string: average time coded by all WakaTime users in this category as a human readable string>,
        },
        "count": {
          "text": <string: number of WakaTime users who coded in this category in the given range>,
        },
        "max": {
          "seconds": <float: number of seconds coded by the WakaTime user who coded the most time in this category>,
          "text": <string: time coded by the WakaTime user who coded the most time in this category>,
        },
        "median": {
          "seconds": <float: median number of seconds coded by all WakaTime users in this category>,
          "text": <string: median time coded by all WakaTime users in this category as a human readable string>,
        },
        "sum": {
          "seconds": <float: sum of all seconds coded by all WakaTime users in this category>,
          "text": <string: sum of all time coded by all WakaTime users in this category as a human readable string>,
        },
      }, …
    ],
    "daily_average": {
      "average": {
        "seconds": <float: average number of seconds coded per day by all WakaTime users in given range>,
        "text": <string: average time coded per day by all WakaTime users in given range as a human readable string>,
      },
      "count": {
        "text": <string: number of WakaTime users in these aggregate stats>,
      },
      "max": {
        "seconds": <float: number of seconds coded per day by the WakaTime user who coded the most time in the given range; this might not be the highest daily average, for ex: a user codes for 23h one day but then stops coding. That user’s daily average is 23h. The user with the most code time has a daily average of 12h. The max is 12h not 23h, because the user with 12h daily average coded more days and more total time than the user with 23h daily average.>,
        "text": <string: daily average as human readable text of the WakaTime user who coded the most time in the given range>,
      },
      "median": {
        "seconds": <float: median number of seconds coded per day by all WakaTime users in given range>,
        "text": <string: median time coded per day by all WakaTime users in given range as a human readable string>,
      },
    },
    "editors": [
      {
        "name": <string: name of this IDE, for ex: Coding or Debugging>,
        "is_verified": <boolean: whether the IDE is verified or unverified>,
        "average": {
          "seconds": <float: average number of seconds coded by all WakaTime users with this IDE>,
          "text": <string: average time coded by all WakaTime users with this IDE as a human readable string>,
        },
        "count": {
          "text": <string: number of WakaTime users who coded with this IDE in the given range>,
        },
        "max": {
          "seconds": <float: number of seconds coded by the WakaTime user who coded the most time with this IDE>,
          "text": <string: time coded by the WakaTime user who coded the most time with this IDE>,
        },
        "median": {
          "seconds": <float: median number of seconds coded by all WakaTime users with this IDE>,
          "text": <string: median time coded by all WakaTime users with this IDE as a human readable string>,
        },
        "sum": {
          "seconds": <float: sum of all seconds coded by all WakaTime users with this IDE>,
          "text": <string: sum of all time coded by all WakaTime users with this IDE as a human readable string>,
        },
      }, …
    ],
    "languages": [
      {
        "name": <string: name of this language, for ex: Coding or Debugging>,
        "is_verified": <boolean: whether the language is verified or unverified>,
        "average": {
          "seconds": <float: average number of seconds coded by all WakaTime users in this language>,
          "text": <string: average time coded by all WakaTime users in this language as a human readable string>,
        },
        "count": {
          "text": <string: number of WakaTime users who coded in this language in the given range>,
        },
        "max": {
          "seconds": <float: number of seconds coded by the WakaTime user who coded the most time in this language>,
          "text": <string: time coded by the WakaTime user who coded the most time in this language>,
        },
        "median": {
          "seconds": <float: median number of seconds coded by all WakaTime users in this language>,
          "text": <string: median time coded by all WakaTime users in this language as a human readable string>,
        },
        "sum": {
          "seconds": <float: sum of all seconds coded by all WakaTime users in this language>,
          "text": <string: sum of all time coded by all WakaTime users in this language as a human readable string>,
        },
      }, …
    ],
    "operating_systems": [
      {
        "name": <string: name of this os, for ex: Coding or Debugging>,
        "is_verified": <boolean: whether the os is verified or unverified>,
        "average": {
          "seconds": <float: average number of seconds coded by all WakaTime users in this os>,
          "text": <string: average time coded by all WakaTime users in this os as a human readable string>,
        },
        "count": {
          "text": <string: number of WakaTime users who coded in this os in the given range>,
        },
        "max": {
          "seconds": <float: number of seconds coded by the WakaTime user who coded the most time in this os>,
          "text": <string: time coded by the WakaTime user who coded the most time in this os>,
        },
        "median": {
          "seconds": <float: median number of seconds coded by all WakaTime users in this os>,
          "text": <string: median time coded by all WakaTime users in this os as a human readable string>,
        },
        "sum": {
          "seconds": <float: sum of all seconds coded by all WakaTime users in this os>,
          "text": <string: sum of all time coded by all WakaTime users in this os as a human readable string>,
        },
      }, …
    ],
    "total": {
      "average": {
        "seconds": <float: average number of seconds coded by all WakaTime users in given range>,
        "text": <string: average time coded by all WakaTime users in given range as a human readable string>,
      },
      "count": {
        "text": <string: number of WakaTime users in these aggregate stats>,
      },
      "max": {
        "seconds": <float: number of seconds coded by the WakaTime user who coded the most time in the given range>,
        "text": <string: time coded by the WakaTime user who coded the most time in the given range>,
      },
      "median": {
        "seconds": <float: median number of seconds coded by all WakaTime users in given range>,
        "text": <string: median time coded by all WakaTime users in given range as a human readable string>,
      },
      "sum": {
        "seconds": <float: sum of all seconds coded by all WakaTime users in given range>,
        "text": <string: sum of all time coded by all WakaTime users in given range as a human readable string>,
      },
    },
    "range": {
      "end_date": <string: end of range as human readable date>,
      "end_text": <string: end of range as ISO 8601 UTC datetime>,
      "name": <string: range of these stats>,
      "start_date": <string: start of range as human readable date>,
      "start_text": <string: start of range as ISO 8601 UTC datetime>,
      "text": <string: range in human-readable format>,
    },
    "timeout": <integer: the default Keystroke Timeout Preference for public stats (15)>,
    "writes_only": <boolean: the default Writes Only Preference for public stats (false)>,
  }
}
Try it out

Status Bar
GET /api/v1/users/:user/status_bar/today

GET /api/v1/users/current/status_bar/today

Description
A user’s coding activity today for displaying in IDE text editor status bars. This is the same as Summaries with range of “Today”. This endpoint is only backed by cached data. If there’s no data yet in the cache, an empty Summary is returned while the cache updates in the background:
{
  "data": {
    "grand_total": {
      "decimal":"",
      "digital":"",
      "hours":0,
      "minutes":0,
      "text":"",
      "total_seconds":0
    },
    "categories":[],
    "dependencies":[],
    "editors":[],
    "languages":[],
    "machines":[],
    "operating_systems":[],
    "projects":[],
    "range": {
      "text":"Today",
      "timezone":"UTC"
    }
  }
}

Scope Required
read_summaries

Example Response
Response Code: 200

{
  "cached_at": <string: when this response was calculated and cached as ISO 8601 UTC datetime>,
  "has_team_features": <boolean: true if user has access to team features>,
  "data": {
    "grand_total": {
      "decimal": <string: total coding activity in decimal format>,
      "digital": <string: total coding activity in digital clock format>,
      "hours": <integer: hours portion of coding activity>,
      "minutes": <integer: minutes portion of coding activity>,
      "text": <string: total coding activity in human readable format>,
      "total_seconds": <float: total coding activity as seconds>
    },
    "categories": [
      {
        "name": <string: name of category, for ex: Coding or Debugging>,
        "total_seconds": <float: total coding activity as seconds>,
        "percent": <float: percent of time spent in this category>,
        "decimal": <string: total coding activity for this category in decimal format>,
        "digital": <string: total coding activity for this category in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this category>,
        "minutes": <integer: minutes portion of coding activity for this category>
      }, …
    ],
    "projects": [
      {
        "name": <string: project name>,
        "total_seconds": <float: total coding activity as seconds>,
        "percent": <float: percent of time spent in this project>,
        "decimal": <string: total coding activity for this project in decimal format>,
        "digital": <string: total coding activity for this project in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this project>,
        "minutes": <integer: minutes portion of coding activity for this project>
      }, …
    ],
    "languages": [
      {
        "name": <string: language name>,
        "total_seconds": <float: total coding activity spent in this language as seconds>,
        "percent": <float: percent of time spent in this language>,
        "decimal": <string: total coding activity for this language in decimal format>,
        "digital": <string: total coding activity for this language in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this language>,
        "minutes": <integer: minutes portion of coding activity for this language>,
        "seconds": <integer: seconds portion of coding activity for this language>
      }, …
    ],
    "editors": [
      {
        "name": <string: editor name>,
        "total_seconds": <float: total coding activity spent in this editor as seconds>,
        "percent": <float: percent of time spent in this editor>,
        "decimal": <string: total coding activity for this editor in decimal format>,
        "digital": <string: total coding activity for this editor in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this editor>,
        "minutes": <integer: minutes portion of coding activity for this editor>,
        "seconds": <integer: seconds portion of coding activity for this editor>
      }, …
    ],
    "operating_systems": [
      {
        "name": <string: os name>,
        "total_seconds": <float: total coding activity spent in this os as seconds>,
        "percent": <float: percent of time spent in this os>,
        "decimal": <string: total coding activity for this os in decimal format>,
        "digital": <string: total coding activity for this os in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this os>,
        "minutes": <integer: minutes portion of coding activity for this os>,
        "seconds": <integer: seconds portion of coding activity for this os>
      }, …
    ],
    "dependencies": [
      {
        "name": <string: dependency name>,
        "total_seconds": <float: total coding activity spent in this dependency as seconds>,
        "percent": <float: percent of time spent in this dependency>,
        "decimal": <string: total coding activity for this dependency in decimal format>,
        "digital": <string: total coding activity for this dependency in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this dependency>,
        "minutes": <integer: minutes portion of coding activity for this dependency>,
        "seconds": <integer: seconds portion of coding activity for this dependency>
      }, …
    ],
    "machines": [
      {
        "name": <string: machine hostname and ip address>,
        "machine_name_id": <string: unique id of this machine>,
        "total_seconds": <float: total coding activity spent on this machine as seconds>,
        "percent": <float: percent of time spent on this machine>,
        "decimal": <string: total coding activity for this machine in decimal format>,
        "digital": <string: total coding activity for this machine in digital clock format>,
        "text": <string: total coding activity in human readable format>,
        "hours": <integer: hours portion of coding activity for this machine>,
        "minutes": <integer: minutes portion of coding activity for this machine>,
        "seconds": <integer: seconds portion of coding activity for this machine>
      }, …
    ],
    "range": {
      "date": <string: this day as Date string in YEAR-MONTH-DAY format>,
      "start": <string: start of this day as ISO 8601 UTC datetime>,
      "end": <string: end of this day as ISO 8601 UTC datetime>,
      "text": <string: this day in human-readable format relative to the current day>,
      "timezone": <string: timezone used in Olson Country/Region format>
    }
  }
}
Try it out

Summaries
GET /api/v1/users/:user/summaries

GET /api/v1/users/current/summaries

Description
A user's coding activity for the given time range as an array of summaries segmented by day. Summaries are read-only representations of Heartbeats and Durations, created by joining multiple Heartbeats together when they’re within 15 minutes of each other. The 15 minutes default can be changed with your account’s Keystroke Timeout preference.

URL Parameters
start - Date - required - Start date of the time range.

end - Date - required - End date of the time range.

project - String - optional - Only show time logged to this project.

branches - String - optional - Only show coding activity for these branches; comma separated list of branch names.

timeout - Integer - optional - The keystroke timeout preference used when joining heartbeats into durations. Defaults the the user's keystroke timeout value. See the FAQ for more info.

writes_only - Boolean - optional - The writes_only preference. Defaults to the user's writes_only setting.

timezone - String - optional - The timezone for given start and end dates. Defaults to the user's timezone.

range - String - optional - Alternative way to supply start and end dates. Can be one of “Today”, “Yesterday”, “Last 7 Days”, “Last 7 Days from Yesterday”, “Last 14 Days”, “Last 30 Days”, “This Week”, “Last Week”, “This Month”, or “Last Month”.

Scope Required
read_summaries

Example Response
Response Code: 200

{
  "data": [
    {
      "grand_total": {
        "digital": <string: total coding activity in digital clock format>,
        "hours": <integer: hours portion of coding activity>,
        "minutes": <integer: minutes portion of coding activity>,
        "text": <string: total coding activity in human readable format>,
        "total_seconds": <float: total coding activity as seconds>
      },
      "categories": [
        {
          "name": <string: name of category, for ex: Coding or Debugging>,
          "total_seconds": <float: total coding activity as seconds>,
          "percent": <float: percent of time spent in this category>,
          "digital": <string: total coding activity for this category in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this category>,
          "minutes": <integer: minutes portion of coding activity for this category>
        }, …
      ],
      "projects": [
        {
          "name": <string: project name>,
          "total_seconds": <float: total coding activity as seconds>,
          "percent": <float: percent of time spent in this project>,
          "digital": <string: total coding activity for this project in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this project>,
          "minutes": <integer: minutes portion of coding activity for this project>
        }, …
      ],
      "languages": [
        {
          "name": <string: language name>,
          "total_seconds": <float: total coding activity spent in this language as seconds>,
          "percent": <float: percent of time spent in this language>,
          "digital": <string: total coding activity for this language in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this language>,
          "minutes": <integer: minutes portion of coding activity for this language>,
          "seconds": <integer: seconds portion of coding activity for this language>
        }, …
      ],
      "editors": [
        {
          "name": <string: editor name>,
          "total_seconds": <float: total coding activity spent in this editor as seconds>,
          "percent": <float: percent of time spent in this editor>,
          "digital": <string: total coding activity for this editor in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this editor>,
          "minutes": <integer: minutes portion of coding activity for this editor>,
          "seconds": <integer: seconds portion of coding activity for this editor>
        }, …
      ],
      "operating_systems": [
        {
          "name": <string: os name>,
          "total_seconds": <float: total coding activity spent in this os as seconds>,
          "percent": <float: percent of time spent in this os>,
          "digital": <string: total coding activity for this os in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this os>,
          "minutes": <integer: minutes portion of coding activity for this os>,
          "seconds": <integer: seconds portion of coding activity for this os>
        }, …
      ],
      "dependencies": [
        {
          "name": <string: dependency name>,
          "total_seconds": <float: total coding activity spent in this dependency as seconds>,
          "percent": <float: percent of time spent in this dependency>,
          "digital": <string: total coding activity for this dependency in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this dependency>,
          "minutes": <integer: minutes portion of coding activity for this dependency>,
          "seconds": <integer: seconds portion of coding activity for this dependency>
        }, …
      ],
      "machines": [
        {
          "name": <string: machine hostname and ip address>,
          "machine_name_id": <string: unique id of this machine>,
          "total_seconds": <float: total coding activity spent on this machine as seconds>,
          "percent": <float: percent of time spent on this machine>,
          "digital": <string: total coding activity for this machine in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this machine>,
          "minutes": <integer: minutes portion of coding activity for this machine>,
          "seconds": <integer: seconds portion of coding activity for this machine>
        }, …
      ],
      "branches": [ // included only when project url parameter used
        {
          "name": <string: branch name>,
          "total_seconds": <float: total coding activity spent in this branch as seconds>,
          "percent": <float: percent of time spent in this branch>,
          "digital": <string: total coding activity for this branch in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this branch>,
          "minutes": <integer: minutes portion of coding activity for this branch>,
          "seconds": <integer: seconds portion of coding activity for this branch>
        }, …
      ],
      "entities": [ // included only when project url parameter used
        {
          "name": <string: entity name>,
          "total_seconds": <float: total coding activity spent in this entity as seconds>,
          "percent": <float: percent of time spent in this entity>,
          "digital": <string: total coding activity for this entity in digital clock format>,
          "text": <string: total coding activity in human readable format>,
          "hours": <integer: hours portion of coding activity for this entity>,
          "minutes": <integer: minutes portion of coding activity for this entity>,
          "seconds": <integer: seconds portion of coding activity for this entity>
        }, …
      ],
      "range": {
        "date": <string: this day as Date string in YEAR-MONTH-DAY format>,
        "start": <string: start of this day as ISO 8601 UTC datetime>,
        "end": <string: end of this day as ISO 8601 UTC datetime>,
        "text": <string: this day in human-readable format relative to the current day>,
        "timezone": <string: timezone used in Olson Country/Region format>
      }
    }, …
  ],
  "cumulative_total": {
    "seconds": <float: cumulative number of seconds over the date range of summaries>,
    "text": <string: cumulative total coding activity in human readable format>,
    "decimal": <string: cumulative total as a decimal>,
    "digital": <string: cumulative total in digital clock format>,
  },
  "daily_average": {
    "holidays": <integer: number of days in this range with no coding time logged>,
    "days_including_holidays": <integer: number of days in this range>,
    "days_minus_holidays": <integer: number of days in this range excluding days with no activity>,
    "seconds": <float: average coding activity per day as seconds for the given range of time, excluding Other language>,
    "text": <string: daily average, excluding Other language, as human readable string>,
    "seconds_including_other_language": <float: average coding activity per day as seconds for the given range of time>,
    "text_including_other_language": <string: daily average as human readable string>,
  },
  "start": <string: start of time range as ISO 8601 UTC datetime>,
  "end": <string: end of time range as ISO 8601 UTC datetime>,
}
Try it out

User Agents
GET /api/v1/users/:user/user_agents

GET /api/v1/users/current/user_agents

Description
List of plugins which have sent data for this user.

Scope Required
read_stats.editors

Example Response
Response Code: 200

{
  "data": {
    "id": <string: unique id of this user agent>,
    "value": <string: a user agent string>,
    "editor": <string: the editor/IDE name of this user agent>,
    "version": <string: the wakatime plugin version of this user agent>,
    "os": <string: operating system of this user agent>,
    "last_seen_at": <string: time when this user agent was last seen in ISO 8601 format>,
    "is_browser_extension": <boolean: true if this plugin is the browser-wakatime extension>,
    "is_desktop_app": <boolean: true if this plugin is the macos-wakatime native desktop app>,
    "created_at": <string: time when this user agent was first seen in ISO 8601 format>,
  },
}
Try it out

Users
GET /api/v1/users/:user

GET /api/v1/users/current

Description
A single user.

Scope Required
email

Example Response
Response Code: 200

{
  "data": {
    "id": <string: unique id of user>,
    "bio": <string: optional user defined bio>,
    "has_premium_features": <boolean: true if user has access to premium features>,
    "display_name": <string: display name of this user taken from full_name or @username. Defaults to 'Anonymous User'>,
    "full_name": <string: full name of user>,
    "email": <string: email address>,
    "photo": <string: url of photo for this user>,
    "is_email_public": <boolean: whether this user's email should be shown on the public leader board>,
    "is_email_confirmed": <boolean: whether this user's email address has been verified with a confirmation email>,
    "public_email": <string: email address for public profile. Nullable.>,
    "photo_public": <boolean: whether this user's photo should be shown on the public leader board>,
    "timezone": <string: user's timezone in Olson Country/Region format>,
    "last_heartbeat_at": <string: time of most recent heartbeat received in ISO 8601 format>,
    "last_plugin": <string: user-agent string from the last plugin used>,
    "last_plugin_name": <string: name of editor last used>,
    "last_project": <string: name of last project coded in>,
    "last_branch": <string: name of last branch coded in>,
    "plan": <string: users subscription plan>,
    "username": <string: users public username>,
    "website": <string: website of user>,
    "human_readable_website": <string: website of user without protocol part>,
    "wonderfuldev_username": <string: wonderful.dev username of user>,
    "github_username": <string: GitHub username of user>,
    "twitter_username": <string: Twitter handle of user>,
    "linkedin_username": <string: Linkedin username of user>,
    "city": {
      "country_code": <string: two letter code, for ex: US or UK>,
      "name": <string: city name, for ex: San Francisco>,
      "state": <string: state name, for ex: California>,
      "title": <string: city, state (or country if state has same name as city)>
    },
    "logged_time_public": <boolean: coding activity should be shown on the public leader board>,
    "languages_used_public": <boolean: languages used should be shown on the public leader board>,
    "editors_used_public": <boolean: editors used shown on public profile>,
    "categories_used_public": <boolean: categories used shown on public public>,
    "os_used_public": <boolean: operating systems used shown on public public>,
    "is_hireable": <boolean: user preference showing hireable badge on public profile>,
    "created_at": <string: time when user was created in ISO 8601 format>,
    "modified_at": <string: time when user was last modified in ISO 8601 format>,
  },
}
Try it out
