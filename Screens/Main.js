import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';


export default function Main() {
  return(
    <View style={styles.container}>
      <Text>Main section</Text>
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