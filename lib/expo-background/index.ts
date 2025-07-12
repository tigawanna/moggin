import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { fetchHoursAndUpdateWakatimeWidget } from "../datastore/wakatime-widget";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK_IDENTIFIER = "widget-update-task";


function registerBackgroundTask() {
  TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
      console.log("Background task starting");
    try {
      // Perform the background task logic here
      // You can call your update function here
      await fetchHoursAndUpdateWakatimeWidget();
      await AsyncStorage.setItem(BACKGROUND_TASK_IDENTIFIER, "successfully ran this task");
    } catch (error) {
      console.error("Error in background task:", error);
    }
    console.log("Background task completed");
  });

  BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
    minimumInterval: 15, // Run every 15 minutes
  });
}


export async function initializeBackgroundTask(innerAppMountedPromise: Promise<void>) {
  await innerAppMountedPromise; // to ensure the app is fully mounted before registering the task  
  if (TaskManager.isTaskDefined(BACKGROUND_TASK_IDENTIFIER)) {
    console.log("Background task is already defined");
  } else {
    registerBackgroundTask();
    console.log("Background task registered successfully");
  }
}


export const testAllBackgroundTasks = async () => {
  try {
    await AsyncStorage.setItem(BACKGROUND_TASK_IDENTIFIER, "manually testing all background tasks");
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
    console.log("Test Background task started successfully");
    return true;
  } catch (error) {
    console.log("Error starting background task:", error);
    return false;
  }
}

export async function unregisterBackgroundTask() {
  try {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
    console.log("Background task unregistered successfully");
  } catch (error) {
    console.error("Error unregistering background task:", error);
  }
}


export function readKeyFromStorage(): Promise<string | null> {
  return AsyncStorage.getItem(BACKGROUND_TASK_IDENTIFIER);
}
