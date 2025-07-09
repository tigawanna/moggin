# Switch to wakatime only

Our current app has multiple sources for stats iand i wnat to narrow it down to just Wakatime.

The landing page should only display Wakatime stats and remove any other sources. This includes updating the API calls, components, and any state management logic to ensure we're only working with Wakatime data.

The api keys screen should be updated to only include the Wakatime API key, removing any other keys that are no longer needed. on user entre a valid key it should redirect them back to the main screen and fetch the Wakatime data.

screens in tabs i want

###  Home screen tab
- if no user is present it should redirect to the apikeys screen , whenth user enters a valid Wakatime API key it should fetch the user data and redirect to the home screen.
 - the home screen should display the current user name and stats which can be found under 
- daily hours with big text and below it should be a breakdown of hours by project (reuse the existing component for hours and make the rest)

### Weekly stats tab
- This tab should display the weekly stats using the weekly chart that we already built and other weekly stats.

### leaderboard tab
- a leaderboard queryOptions should be created that fetches once and adds a stale time of a day , this query option wil also be used t display the current user leader board standing on the home screen in thelist view iside the leaderboard tab it should highlght whre he current ledaer is and even use a hash route so that clikimg ion the home screen curent user postion component it shoud bringtheemto the leader bprd screen and scroll them down to that spot or do it how expo does such as using a hash route to scroll to the current user position.
- the leaderboard country id will come from the currnt user data and will be used to filter the leaderboard data.
- This tab should display the leaderboard using the existing leaderboard component, but it should only show Wakatime data.

### update the settings tab
- remove biometrics , push notification, pin lock , auto sync options as we will not use them in our app and also remove the clear cache option as we will not use it in our app.

void installing or pausing for confirmation just add the code and bacth all the file manipation actions to the end or at the beginning
