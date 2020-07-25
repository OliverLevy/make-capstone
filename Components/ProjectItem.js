import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";
import { List } from "react-native-paper";
import ArrowUp from "../assets/arrow-up.png";
import ArrowDown from "../assets/arrow-down.png";
import Unchecked from "../assets/check-box.png";
import Checked from "../assets/check-box-checked.png";

class Accordion extends React.Component {
  state = {
    isOpen: false,
    isChecked: false,
  };

  static contextType = UserContext;

  toggle = () => {
    this.state.isOpen
      ? this.setState({ isOpen: false })
      : this.setState({ isOpen: true });
  };

  toggleStep = (index) => {
    const userId = this.context.user.user.uid;
    const projectKey = this.props.projectKey;
    const objKey = this.props.objKey;
    const path = this.props.path;
    const input = this.props.data[index].is_done;
    if (input === false) {
      return firebase
        .database()
        .ref(
          `/users/${userId}/projects/${projectKey}/saved/${objKey}/${path}/${index}`
        )
        .update({ is_done: true });
    } else {
      return firebase
        .database()
        .ref(
          `/users/${userId}/projects/${projectKey}/saved/${objKey}/${path}/${index}`
        )
        .update({ is_done: false });
    }
  };

  handleList = (arr) => {
    return arr.map((item, i) => {
      return (
        <TouchableOpacity
          key={i}
          style={styles.listItem}
          onPress={() => this.toggleStep(i)}
        >
          <Text>{item.item}</Text>
          <Image
            source={item.is_done ? Checked : Unchecked}
            style={styles.arrowIcons}
          />
        </TouchableOpacity>
      );
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.toggle} style={styles.dropdownBtn}>
          <Text>{this.props.title}</Text>
          <Image
            source={this.state.isOpen ? ArrowUp : ArrowDown}
            style={styles.arrowIcons}
          />
        </TouchableOpacity>
        <View style={this.state.isOpen ? styles.show : styles.hide}>
          {this.handleList(this.props.data)}
        </View>
      </View>
    );
  }
}

export default class ProjectItem extends React.Component {
  state = {
    savedVideos: null,
    userId: this.context.user.user.uid,
  };
  static contextType = UserContext;

  componentDidMount() {
    const userId = this.state.userId;
    const projectId = this.props.route.params;
    firebase
      .database()
      .ref(`/users/${userId}/projects/${projectId.id}`)
      .on("value", (suc) => {
        this.setState({
          savedVideos: suc.val(),
        });
      });
  }

  //   componentDidUpdate(_prevProps, prevState){
  // if(this.state.savedVideos !== prevState){
  //   this.projectCard()
  // }
  //   }

  projectCard = () => {
    if (this.state.savedVideos && this.state.savedVideos.saved) {
      const inputObj = this.state.savedVideos.saved;
      const savedKeys = Object.keys(inputObj);
      return savedKeys.map((key) => {
        const output = inputObj[key];
        return (
          <View key={key}>
            {/* <Video
              source={{ uri: output.video_url }}
              style={styles.video}
              useNativeControls
            /> */}
            <Text>{output.video_title}</Text>

            <Accordion
              title="STEPS TO FOLLOW"
              data={output.steps}
              objKey={key}
              projectKey={this.props.route.params.id}
              path="steps"
            />

            <Accordion
              title="REQUIRED MATERIALS"
              data={output.materials}
              objKey={key}
              projectKey={this.props.route.params.id}
              path="materials"
            />
          </View>
        );
      });
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.savedVideos && this.projectCard()}
          <Text>{this.props.route.params.id}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  video: {
    height: 210,
    width: "100%",
  },
  done: {
    color: "red",
    backgroundColor: "red",
  },
  notDone: {
    color: "pink",
    backgroundColor: "pink",
  },
  show: {
    // backgroundColor: "pink",
  },
  hide: {
    display: "none",
  },
  dropdownBtn: {
    // backgroundColor: "pink",
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcons: {
    height: 20,
    width: 20,
  },
  listItem: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
