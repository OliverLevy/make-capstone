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
  TouchableHighlight,
  Modal,
} from "react-native";
import Logo from "../assets/make-logo-white.png";
import Search from "../assets/Icon-search.png";
import { UserContext } from "../Context/UserContext";

import Profile from "../Screens/Profile";

import firebase from "firebase";

// const dbVideoList = firebase.database().ref('/0/')

export default class Header extends React.Component {
  static contextType = UserContext;

  addAvatar = () => {
    if (this.context.user.user) {
      return (
        <Image
          source={{
            uri: this.context.user.additionalUserInfo.profile.picture,
          }}
          style={styles.avatar}
        />
      );
    } else {
      return <View></View>;
    }
  };

  render() {
    return (
      <View style={styles.headerBarContainer}>
        <SafeAreaView style={styles.headerBar}>
          <Image source={Logo} style={styles.logo} />
          <View style={styles.iconContainer}>
            <Image source={Search} style={styles.icon} />
            <Profile />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    height: 38,
    width: 85,
    marginHorizontal: 16
  },
  icon: {
    height: 40,
    width: 40,
    marginHorizontal: 16
  },
  headerBarContainer: {
    backgroundColor: 'pink'
  },
  headerBar: {
    // backgroundColor: "pink",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // height: 110,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: 'center',
    padding: 16
  },
  avatarContainer: {
    backgroundColor: "blue",
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: "hidden",
  }
});
