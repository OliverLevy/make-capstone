import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";


export default function Profile(props) {

  

  return (
        <View style={styles.container}>
          <Text>This is the VideoPlayer</Text>
          <Text>{props.route.params.id}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
