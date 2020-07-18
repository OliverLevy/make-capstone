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
} from "react-native";
import firebase from "firebase";
import { UserContext } from "../Context/UserContext";




export default class VideoList extends React.Component {
  state = {
    videoList: [],
    user: {},
    userId: this.context.user.user.uid
  };

  static contextType = UserContext

  componentDidMount() {
    const id = this.state.userId
    firebase
      .database()
      .ref("/0/video_list/")
      .once("value")
      .then((suc) => {
        console.log(444,suc)
        const output = suc.val();
        this.setState({
          videoList: output,
        });
      });
  }

  
 

  list = () => {
    if (this.state.videoList.length !== 0) {
      const array = this.state.videoList;
      return array.map((item) => {
        return (
          <TouchableOpacity onPress={() => this.props.navigation.navigate("video player", {
            id: item.title
          })} key={item.date_posted}>
            <View>
              <Image style={styles.poster} source={{ uri: item.poster }} />
              <Image style={styles.avatar} source={{ url: item.avatar }} />
              <Text>{item.title}</Text>
              <Text>{item.channel}</Text>
              <Text>{item.likes}</Text>
              <Text>{item.date_posted}</Text>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      return <Text>loading...</Text>
    }
  };

  render() {
    return (
      <View style={styles.white}>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <Text>This is the video list</Text>
              <View>{this.list()}</View>
              <Button
                title="watch this video"
                onPress={() => this.props.navigation.navigate("video player")}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
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
  poster: {
    height: 210,
    width: 375,
  },
  avatar: {
    height: 50,
    width: 50,
  },
  white: {
    backgroundColor: "white",
  },
});
