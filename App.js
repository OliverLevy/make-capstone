import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import * as firebase from 'firebase'
import { firebaseConfig } from './config'
// firebase.initializeApp(firebaseConfig)

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


import Login from "./Screens/Login";
import Loading from "./Screens/Loading";
import Main from "./Screens/Main";

const AuthStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthStack.Navigator>
        <AuthStack.Screen name="Loading" component={Loading} />
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Main" component={Main} />
      </AuthStack.Navigator>
    </NavigationContainer>
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