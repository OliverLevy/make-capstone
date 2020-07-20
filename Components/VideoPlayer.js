import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { Video } from "expo-av";
import { List } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default class VideoPlayer extends React.Component {
  state = {
    videoUrl: null,
    videoPlayer: null,
    stepIsOpen: false,
    materialIsOpen: false,
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
    firebase
      .database()
      .ref(`/video_player/${this.props.route.params.video_id}`)
      .once("value")
      .then((suc) => {
        console.log(6969, suc.val());
        const output = suc.val();
        this.setState({
          videoPlayer: output,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.videoUrl !== prevState.videoUrl) {
      console.log(321, this.state);
    }
  }

  render() {
    const video = this.state.videoPlayer;
    if (this.state.videoPlayer === null && this.state.videoUrl === null) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Video
            source={{ uri: this.state.videoUrl }}
            useNativeControls
            style={styles.backgroundVideo}
          />
          <ScrollView>
            <Text>This is the VideoPlayer</Text>
            <Text>{this.props.route.params.video_id}</Text>
            <Text>{video.video_title}</Text>
            <Text>{video.channel_name}</Text>
            <Text>{video.likes}</Text>
            <Text>{video.views}</Text>
            <Text>{video.description}</Text>
            <Image
              source={{ uri: video.channel_avatar }}
              style={{ height: 48, width: 48 }}
            />

            <List.Section>
              <List.Accordion
                title="STEP BY STEP"
                description="steps to keep you on task!"
              >
                {video.steps.map((item, i) => {
                  return <List.Item title={item} key={i} />;
                })}

                <List.Item title="this is in the list" />
                <List.Item title="this is in the list" />
              </List.Accordion>
              <List.Accordion
                title="MATERIALS"
                description={`Materials suggested by ${video.channel_name}`}
              >
                {video.materials.map((item, i) => {
                  return <List.Item title={item} key={i} />;
                })}
              </List.Accordion>
            </List.Section>
          </ScrollView>
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
  backgroundVideo: {
    // position: "absolute",
    width: "100%",
    height: 210,
    // top: 0,
  },
});
