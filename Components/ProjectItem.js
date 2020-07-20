import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";

export default function ProjectItem(props) {
  console.log(props.route.params.name)
  return (
    <View>
      <Text>{props.route.params.name}</Text>
    </View>
  );
}
