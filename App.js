import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, Avatar } from "react-native-paper";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";

import TodoItem from "./components/TodoItem";

export default function App() {
  const [isLoading, setLoading] = useState(true); // page loading state
  const [todos, setTodos] = useState([]); // set todos from the API
  const [controlRefreshing, setControlRefreshing] = useState(false); // refreshing control

  // fetch todos "jsonplaceholder.typicode.com"
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
      .then((response) => response.json())
      .then((json) => setTodos(json))
      .catch((err) => console.err(err))
      .finally(() => setLoading(false));
  }, []);

  // delete a todo with "id" from the API call
  const deleteTodo = (id) => {
    setTodos((currentTodo) => {
      return currentTodo.filter((todo) => todo.id !== id);
    });
  };

  // delete all todos from the API call
  const deleteAllTodo = () => {
    setTodos([]);
  };

  // what will happen after the refresh is done:
  const onRefreshComplete = () => {
    setControlRefreshing(true);
    console.warn("Refresh complete");
    setControlRefreshing(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {isLoading ? (
          <View style={styles.loadingText}>
            <Avatar.Image size={30} source={require("./assets/favicon.png")} />
          </View>
        ) : (
          <View>
            <Text style={styles.headerTitle}>
              Todos
              <Pressable onPress={deleteAllTodo} style={{ marginLeft: 15 }}>
                <Text
                  style={{
                    color: "blue",
                    opacity: 0.3,
                    fontStyle: "italic",
                    textTransform: "lowercase",
                    fontSize: 12,
                  }}
                >
                  Empty List
                </Text>
              </Pressable>
            </Text>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={controlRefreshing}
                  onRefresh={onRefreshComplete}
                />
              }
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              data={todos}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <TodoItem
                  title={item.title}
                  icon={item.id % 2 === 0 ? "calendar" : "folder"}
                  color={item.id % 2 === 0 ? "red" : "blue"}
                  onDelete={deleteTodo}
                  id={item.id}
                />
              )}
            />
          </View>
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 22,
    margin: 8,
  },
});
