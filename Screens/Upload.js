import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";


export default function Upload() {
  return (
        <View style={styles.container}>
          <Text>upload page </Text>
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
