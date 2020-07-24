import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";

export default class ProjectItem extends React.Component {
  state = {
    savedVideos: null,
    userId: this.context.user.user.uid,
  };
  static contextType = UserContext;

  componentDidMount() {
    const userId = this.state.userId;
    const projectId = this.props.route.params;
    console.log(userId);
    console.log(projectId.id);
    firebase
      .database()
      .ref(`/users/${userId}/projects/${projectId.id}`)
      .on("value", (suc) => {
        this.setState({
          savedVideos: suc.val(),
        });
      });
  }
  render() {
    console.log(this.state);
    return (
      <View>
        <Text>{this.props.route.params.id}</Text>
      </View>
    );
  }
}
