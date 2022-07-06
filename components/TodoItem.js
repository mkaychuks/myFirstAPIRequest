import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { List } from "react-native-paper";

const TodoItem = (props) => {
  return (
    <View style={styles.listItem}>
      <List.Item
        title={props.title}
        left={() => <List.Icon color={props.color} icon={props.icon} />}
        titleStyle={styles.title}
        right={() => (
          <Pressable onPress={() => console.log('Delete button clicked')}>
            <List.Icon color={props.color} icon={"delete"} />
          </Pressable>
        )}
      />
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    flex: 1,
  },
  title: {
    fontWeight: "700",
    paddingEnd: 12,
  },
});
