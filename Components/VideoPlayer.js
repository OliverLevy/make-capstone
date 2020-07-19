import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { Video } from 'expo-av';

export default class VideoPlayer extends React.Component {
  state = {
    videoUrl: "",
  };

  componentDidMount() {
    firebase
      .storage()
      .ref(`video_player/${this.props.route.params.video_id}.mp4`)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        this.setState({
          videoUrl: url,
        });
      });
    console.log(911, this.props.route.params.video_id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.videoUrl !== prevState.videoUrl) {
      console.log(321, this.state.videoUrl);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the VideoPlayer</Text>
        <Text>{this.props.route.params.video_id}</Text>
        <Video
          source={{ uri: this.state.videoUrl }}
          useNativeControls
          
          style={styles.backgroundVideo}
        />
      </View>
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
  backgroundVideo: {
    position: 'absolute',
    width: '100%',
    height: 210,
    top: 0,
  },
});
