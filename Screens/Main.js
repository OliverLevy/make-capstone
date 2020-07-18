import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";
import { UserProvider, UserContext } from "../Context/UserContext";



export default function Main() {
  return (
        <View style={styles.container}>
          <Text>Main section</Text>
          <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
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
