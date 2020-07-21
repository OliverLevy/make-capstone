import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";
import { Video } from "expo-av";
import { List } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import ViewsIcon from "../assets/icon-view.png";
import LikeIcon from "../assets/icon-heart.png";

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

  dynaDate = (datePosted) => {
    let seconds = (Date.now() - datePosted) / 1000;
    let unix = new Date(datePosted);
    let day = unix.getDate();
    let month = unix.getMonth() + 1;
    let year = unix.getFullYear();
    if (seconds < 60) {
      return `${Math.trunc(seconds)}s ago`;
    } else if (seconds < 3600) {
      return `${Math.trunc(seconds / 60)}m ago`;
    } else if (seconds < 86400) {
      return `${Math.trunc(seconds / 60 / 60)}h ago`;
    } else if (seconds < 2592000) {
      return `${Math.trunc(seconds / 30 / 60 / 60)}d ago`;
    } else {
      return `${month}/${day}/${year}`;
    }
  };

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
          <ScrollView style={styles.textContainer}>
            <View style={styles.info}>
              <Image
                source={{ uri: video.channel_avatar }}
                style={styles.avatar}
              />

              <View style={styles.infoText}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{video.video_title}</Text>
                  <Text style={styles.p}>{video.channel_name}</Text>
                </View>

                <View style={styles.dataContainer}>
                  <Text style={styles.p}>
                    {this.dynaDate(Number(video.date_posted))}
                  </Text>
                  <View style={styles.data}>
                    <View style={styles.iconContainer}>
                      <Image source={LikeIcon} style={styles.icon} />
                      <Text style={styles.p}>{video.likes}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                      <Image source={ViewsIcon} style={styles.icon} />
                      <Text style={styles.p}>{video.views}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Text>{video.description}</Text>

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
    backgroundColor: "#fff",
    flex: 1
  },
  backgroundVideo: {
    // position: "absolute",
    width: "100%",
    height: 210,
    // top: 0,
  },
  textContainer: {
    padding: 16,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  iconContainer: {
    flexDirection: "row",
  },
  info: {
    flexDirection: "row",
  },
  infoText: {
    flex: 1,
  },
  label: {
    color: "grey",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  p: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    height: 20,
    width: 20,
    marginHorizontal: 8,
  },
  titleContainer: {
    // width: "60%",
    padding: 8,
  },
  dataContainer: {
    // width: "40%",
    padding: 8,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  data: {
    flexDirection: "row",
  },
});
