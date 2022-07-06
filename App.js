import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, Avatar, List } from "react-native-paper";
import { StyleSheet, View, FlatList, Text } from "react-native";
import React, { useState, useEffect } from "react";

import TodoItem from "./components/TodoItem";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=30")
      .then((response) => response.json())
      .then((json) => setTodos(json))
      .catch((err) => console.err(err))
      .finally(() => setLoading(false));
  }, []);

  const deleteTodo = (id) => {
    setTodos(currentTodo => {
      return currentTodo.filter((todo) => todo.id !== id )
    })
  }

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
            <Text style={styles.headerTitle}>Todos</Text>
            <FlatList
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              data={todos}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <TodoItem
                  title={item.title}
                  icon={item.id % 2 === 0 ? "calendar" : "folder"}
                  color={item.id % 2 === 0 ? "red" : "blue"}
                  onDelete = {deleteTodo}
                  id = {item.id}
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
    marginTop: 30,
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
    fontWeight: '700',
    fontSize: 22,
    margin: 8
  }
});
