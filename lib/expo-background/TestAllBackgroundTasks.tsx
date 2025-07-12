import { useMutation, useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import { readKeyFromStorage, testAllBackgroundTasks, unregisterBackgroundTask } from ".";
import * as TaskManager from "expo-task-manager";


export function TestAllBackgroundTasks() {
  const { data, isLoading } = useQuery({
    queryKey: ["registered-tasks"],
    queryFn: async () => {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      const asyncStorage = await readKeyFromStorage()
      // console.log("Registered Tasks:", tasks);
      return {tasks, asyncStorage} as const;
    },
    // enabled: false, // Disable this query as we are not using it directly
  });
  const { mutate, isPending } = useMutation({
    mutationFn: testAllBackgroundTasks,
  });
  const { mutate: unregisterMutate, isPending: isUnregisterPending } = useMutation({
    mutationFn: unregisterBackgroundTask,
  });
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">TestAllBackgroundTasks</Text>
      <View style={{ justifyContent: "space-between", width: "100%" }}>
        <Text variant="bodyMedium">AsyncStorage Key: {data?.asyncStorage}</Text>
        {data?.tasks.map((task) => (
          <View key={task.taskName} style={{ marginBottom: 16, width: "100%", padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
            <Text variant="headlineLarge">{task.taskName}</Text>
            <Text variant="bodyMedium">{task.taskType}</Text>
            <View>
              <Text variant="bodySmall">{JSON.stringify(task.options, null, 2)}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "column" }}>
        <Button mode="contained" onPress={() => mutate()}>
          {isPending ? "Testing..." : "Test Background Tasks"}
        </Button>
        <Button mode="contained" onPress={() => unregisterMutate()}>
          {isUnregisterPending ? "Unregistering..." : "Unregister Background Task"}
        </Button>
      </View>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    gap: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
