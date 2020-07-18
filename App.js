import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserContext } from "./Context/UserContext";

import firebase from "firebase";
import { firebaseConfig } from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import Login from "./Screens/Login";
import Loading from "./Screens/Loading";
import Main from "./Screens/Main";
import Projects from "./Screens/Projects";

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

export default class App extends React.Component {
  state = {
    user: {},
    loggedIn: false,
  };

  setUser = (user) => {
    this.setState({
      user: user,
    });
    console.log("the state was set");
  };

  componentDidUpdate() {
    console.log("component updated");
  }

  componentDidMount() {
    console.log("the component mounted");
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
        });
      } else {
        this.setState({
          loggedIn: false,
        });
      }
    });
  };

  componentDidMount(){
    this.checkIfLoggedIn()
  }

  render() {
    console.log(this.state.loggedIn)
    if (this.state.loggedIn === true) {
      return (
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tabs.Navigator>
            <Tabs.Screen name="home" component={Main} />
            <Tabs.Screen name="projects" component={Projects} />
          </Tabs.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <StatusBar style="auto" />
          <AuthStack.Navigator>
            <AuthStack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} setUser={this.setUser} />}
            </AuthStack.Screen>
          </AuthStack.Navigator>
        </NavigationContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
