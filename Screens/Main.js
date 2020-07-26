import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VideoList from "../Components/VideoList";
import VideoPlayer from "../Components/VideoPlayer";
import Profile from "../Screens/Profile";

const HomeStack = createStackNavigator();

export default class Main extends React.Component {
  componentDidMount() {
    console.log("main component mounted");
  }

  render() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="video list"
          component={VideoList}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen
          name="video player"
          component={VideoPlayer}
          options={{ headerShown: false }}
        />
      </HomeStack.Navigator>
    );
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

{
  /* <View style={styles.container}>
                <Text>Main section</Text>
                <Text>Good morning {user.user.additionalUserInfo.profile.given_name}</Text>
                <Button
                  title="Sign Out"
                  onPress={() => firebase.auth().signOut()}
                />
              </View> */
}
