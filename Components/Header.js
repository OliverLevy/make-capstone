import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal
} from "react-native";
import Logo from "../assets/make-logo-white.png";
import Search from "../assets/Icon-search.png";
import { UserContext } from "../Context/UserContext";

import firebase from "firebase";

// const dbVideoList = firebase.database().ref('/0/')

export default class Header extends React.Component {
  static contextType = UserContext;

  render() {
    console.log(888,this.props)
    if (this.context.user.user) {
      console.log(333, this.context.user.additionalUserInfo.profile.picture);
      return (
        <View style={styles.headerBar}>
          <SafeAreaView>
            <Image source={Logo} style={styles.logo} />
            <Image source={Search} style={styles.icon} />
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: this.context.user.additionalUserInfo.profile.picture,
                }}
                style={styles.avatar}
              />
            </View>
          </SafeAreaView>
        </View>
      );
    } else {
      return (
        <View style={styles.headerBar}>
          
        </View>
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
  logo: {
    height: 38,
    width: 85,
  },
  icon: {
    height: 40,
    width: 40,
  },
  headerBar: {
    backgroundColor: "pink",
  },
  avatarContainer: {
    backgroundColor: "blue",
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatar: {
    height: 48,
    width: 48,
  },
});
