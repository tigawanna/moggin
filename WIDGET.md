## TLDR for uilding a widget in Expo using expo modules

- Create a new Expo module for your widget
- Implement the widget logic in Kotlin/Java
- Declare the widget in the AndroidManifest.xml inside the native module
- The widget will get auto includede when you run `expo prebuild`
If the widgte has state you can create methods in your native module to update the state 
> [!NOTE]
> Up to this point our native module was empty since our homescreen widget exists outside our app and is not part of the app's state or code , it exists independently with the android manifest as it's entry point.


- if your widget needs to auto update its state, you can create a method in your native module to update the state consider using a work manager and using a config plugin to initialize the work manager in the app's main activity.
- You can use config plugins to setup other configurations like the adding project level dependancies like the jetpack compose plugin required at the project level
