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
  const [posts, setposts] = useState([]); // set posts from the API
  const [controlRefreshing, setControlRefreshing] = useState(false); // refreshing control
  const [postID, setPostID] = useState(3) // a handle ID for the param in the API call

  // fetch posts "jsonplaceholder.typicode.com"
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?_limit=2`)
      .then((response) => response.json())
      .then((json) => setposts(json))
      .catch((err) => console.err(err))
      .finally(() => setLoading(false));
  }, []);

  // delete a todo with "id" from the API call
  const deleteTodo = (id) => {
    setposts((currentTodo) => {
      return currentTodo.filter((todo) => todo.id !== id);
    });
  };

  // delete all posts from the API call
  const deleteAllTodo = () => {
    setposts([]); 
  };


  // what will happen after the refresh is done:
  const onRefreshComplete = () => {
    setPostID(Math.floor(Math.random() * 100) + 4)
    setControlRefreshing(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postID}`)
    .then((response) => response.json())
      .then((json) => setposts([...posts, json]))
      .catch((err) => console.err(err))
      .finally(() => setControlRefreshing(false));
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
              posts
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
              data={posts}
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
