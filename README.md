# Setting Up Expo Glance Widget Project

## 1. Create a New Expo Project

```sh
npx create-expo-app@latest

```

## 2. Add Development Client

```sh
npx expo install expo-dev-client
```

## 3. Build to Test Configuration

```sh
npm run build:android
```

## 4. Add Native Module

Follow the [native module integration guide](https://docs.expo.dev/modules/get-started/#add-a-new-module-to-an-existing-application)

```sh
pnpx create-expo-module@latest expo-glance-widget --local
```

```sh
npm run build:android
```


converst
```sh
```
