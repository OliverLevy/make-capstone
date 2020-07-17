import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from 'firebase'




// function addUser(){
//   firebase.database().ref('users/' + id).set({
//     first_name: 'oliver',
//     last_name: 'levy',
//     id: 1
//   })
// }


export default function Main() {
  return(
    <View style={styles.container}>
      <Text>Main section</Text>
      <Text>more Main section</Text>
      <Button title='Sign Out' onPress={() => firebase.auth().signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});