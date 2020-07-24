import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Video } from "expo-av";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";
import { List } from "react-native-paper";
import ArrowUp from "../assets/arrow-up.png";
import ArrowDown from "../assets/arrow-down.png";

class Accordion extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.state.isOpen
      ? this.setState({ isOpen: false })
      : this.setState({ isOpen: true });
  };

  handleList = (arr) => {
    return arr.map((item, i) => {
      return <Text>{item.item}</Text>;
    });
  };

  render() {
    console.log(12321, this.state.isOpen);
    return (
      <View>
        <TouchableOpacity onPress={this.toggle} style={styles.dropdown}>
          <Text>{this.props.title}</Text>
          <Image source={ArrowUp} style={styles.arrowIcons} />
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
        console.log(output);
        return (
          <View>
            {/* <Video
              source={{ uri: output.video_url }}
              style={styles.video}
              useNativeControls
            /> */}
            <Text>{output.video_title}</Text>

            <Text>Steps</Text>
            <Accordion title="STEPS TO FOLLOW" data={output.steps} />
            <Text>Materials</Text>
            <Accordion title="REQUIRED MATERIALS" data={output.materials} />
          </View>
        );
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.savedVideos && this.projectCard()}
        <Text>{this.props.route.params.id}</Text>
      </View>
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
    backgroundColor: "pink",
  },
  hide: {
    display: "none",
  },
  dropdown: {
    backgroundColor: "pink",
    height: 48,
  },
  arrowIcons: {
    height: 20,
    width: 20,
  },
});
