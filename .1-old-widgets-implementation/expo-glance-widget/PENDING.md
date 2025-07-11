WHen working on the tasks below do not ptompt for confirmation just do as much of the work as possible without needing me to run commnds or provide input , that will be doen durin the review period

This project in `/module/expo-glance-widget` consists of 

### config plugins to

- [x] copy all files from our target directory that will include kotlin classes and resource in the res dir and xml file like `AndroidManifest.xml`
- [x] support a pattern to match widget files

- [x] copy files from a specific directory in the Android project to the Expo project
  - issues
    - [x] not copying all files in the specified directory
    - [x] ensure that the copied files have the correct package name
    - [x] ensure proper directory structure is maintained even in the `/widgets` directory that we copy into our project for it to be checked into source control because rarely will our widget project be in our expo project it'll be in an external android studio project directory
    - [ ] ensure that widgetFiles is confirmed to exist if not use the syncDirectory

config example

```ts
[
  withExpoGlanceWidgets as any,
  {
        widgetFilesPath:
          "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii",
        manifestPath:
          "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\AndroidManifest.xml",
        resPath: "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\res",
        // Only copy from these specific directories
        includeDirectories: ["wakatime"],
  },
],
```

- [x] when renaming packages also look for imports

example:

```kotlin
import com.tigawanna.bidii.BidiiWidgetConstants
import com.tigawanna.bidii.MainActivity
import com.tigawanna.bidii.R
```

and transform them to the target directory package name

example:

```kotlin
import com.yourexpoapp.widgets.BidiiWidgetConstants
import com.yourexpoapp.MainActivity
import com.yourexpoapp.R
```

- [x] merge `AndroidManifest.xml` into the expo project's one
  - this was initially only copying receivers but now we can merge permissions as well

### native module to update the datastore that our widget depends on

- [ ] add a generic CRUD interface for the datastore
- [ ] expose as an expo plugin with proper TypeScript


### Tests

- [ ] add unit tests for the config plugins , mostly just to recreate a directory structure and ensure that the files are copied correctly
- [ ] add tests to make sure that the package names are updated correctly
- [ ] add tests to ensure that the AndroidManifest.xml is merged correctly
- [ ] add tests to make sure that the res files are copied correctly
- [ ] add tests to ensure that the file match pattern works correctly 
- [ ]   add tests to make sure that the gradle dependencies are added correctly
- [ ] add integration tests for the native module

