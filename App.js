import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider, Avatar, List } from "react-native-paper";
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
  const [postID, setPostID] = useState(3); // a handle ID for the param in the API call

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
    setPostID(Math.floor(Math.random() * 100) + 4);
    setControlRefreshing(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postID}`)
      .then((response) => response.json())
      .then((json) => setposts([...posts, json]))
      .catch((err) => console.err(err))
      .finally(() => setControlRefreshing(false));
  };

  return (
    <PaperProvider>
      {isLoading ? (
        <View style={styles.loadingText}>
          <Avatar.Image size={100} source={require("./assets/icon.png")} />
          <Text style={{ fontStyle: "italic", fontSize: 10, marginTop: 8 }}>
            retrieving posts
          </Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {/* The container housing the header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Posts</Text>
            <Pressable onPress={deleteAllTodo}>
              <List.Icon color="red" icon={"delete-forever"} />
            </Pressable>
          </View>

          {/* The container that will house the list item */}
          <View
            style={{
              width: "100%",
              marginTop: 15,
            }}
          >
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
                  icon={"newspaper"}
                  color={"black"}
                  onDelete={deleteTodo}
                  id={item.id}
                />
              )}
            />
          </View>
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 30,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 22,
    margin: 8,
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
