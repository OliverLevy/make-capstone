import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { Video, Audio } from "expo-av";
import firebase, { storage } from "firebase";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuid } from "uuid";
import { ScrollView } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import DeleteIcon from "../assets/icon-delete.png";
import { UserContext } from "../Context/UserContext";

export default class Upload extends React.Component {
  state = {
    video: null,
    video_url: null,
    poster: null,
    poster_url: null,
    title: null,
    description: null,
    newStep: null,
    steps: [],
    newMaterial: null,
    materials: [],
    scrollY: null,
    scrollX: null,
  };

  static contextType = UserContext;

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  // step 1
  handleChooseVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.1,
      });
      if (!result.cancelled) {
        this.setState({
          video: result,
        })
          .then(() => {
            Alert.alert("success");
          })
          .catch((error) => {
            Alert.alert(error);
          });
      }
    } catch (E) {
      console.log(E);
    }
  };

  handleChoosePoster = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.1,
      });
      if (!result.cancelled) {
        this.setState({
          poster: result,
        })
          .then(() => {
            Alert.alert("success");
          })
          .catch((error) => {
            Alert.alert(error);
          });
      }
    } catch (E) {
      console.log(E);
    }
  };

  uploadVideo = async (uri, videoId) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase
      .storage()
      .ref()
      .child("videos/" + videoId);

    return ref.put(blob);
  };

  //get url for video

  uploadVideoPoster = async (uri, videoPosterId) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase
      .storage()
      .ref()
      .child("videos_poster/" + videoPosterId);
    return ref.put(blob);
  };

  getVideoUrl = (id) => {
    const output = firebase
      .storage()
      .ref(`/videos/${id}`)
      .getDownloadURL()
      .then((videoUrl) => {
        console.log(911, videoUrl);
        return videoUrl;
      })
      .catch((err) => {
        console.log(3663, err);
      });
    return output;
  };

  getPosterUrl = (id) => {
    const output = firebase
      .storage()
      .ref(`/videos_poster/${id}`)
      .getDownloadURL()
      .then((posterUrl) => {
        console.log(119, posterUrl);
        return posterUrl;
      })
      .catch((err) => {
        console.log(3663, err);
      });
    return output;
  };

  addToStep = () => {
    this.stepsInput.clear();
    this.moveScroll();
    this.setState({
      steps: [...this.state.steps, this.state.newStep],
    });
  };

  addToMaterials = () => {
    this.materialsInput.clear();
    this.moveScroll();
    this.setState({
      materials: [...this.state.materials, this.state.newMaterial],
    });
  };

  list = (input) => {
    const list = input;
    return input.map((item, i) => {
      return (
        <Swipeable renderRightActions={this.renderLeftActions} key={i}>
          <Text
            style={styles.listItem}
            ref={(listItem) => {
              this._listItem = listItem;
            }}
          >
            {`${i + 1}. `}
            {item}
          </Text>
        </Swipeable>
      );
    });
  };

  renderLeftActions = (id, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 0],
    });
    return (
      <RectButton style={styles.leftAction} onPress={() => this.delete(id)}>
        <Animated.Text
          style={[styles.actionText, { transform: [{ translateX: trans }] }]}
        >
          <Image source={DeleteIcon} style={styles.icon} />
        </Animated.Text>
      </RectButton>
    );
  };

  setScrollPosition = (event) => {
    this.setState({
      scrollX: event.nativeEvent.contentOffset.x,
      scrollY: event.nativeEvent.contentOffset.y,
    });
  };

  moveScroll = () => {
    this._scrollPosition.scrollTo({ y: this.state.scrollY + 48 });
  };

  newSubmit = async () => {
    const { video, poster, title, description, steps, materials } = this.state;
    const datePosted = Date.now();
    const uploadKey = firebase.database().ref().child("uploads").push().key;

    // upload the video
    await this.uploadVideo(video.uri, uploadKey)
      .then(() => {
        Alert.alert("video upload success");
      })
      .catch((error) => {
        Alert.alert(error);
      });

    // once complete, get the downloadurl from firebase and set state of videourl
    let videoUrl = await this.getVideoUrl(uploadKey);

    // upload the poster
    await this.uploadVideoPoster(poster.uri, uploadKey)
      .then(() => {
        Alert.alert("poster upload success");
      })
      .catch((error) => {
        Alert.alert(error);
      });

    // once complete, get the downloadurl from firebase and set state of videourl
    let posterUrl = await this.getPosterUrl(uploadKey);
    // get state of all the other text inputs and upload them to the database
    const videoListData = {
      avatar: this.context.user.additionalUserInfo.profile.picture,
      channel: this.context.user.user.displayName,
      date_posted: datePosted,
      likes: 0,
      views: 0,
      id: uploadKey,
      title: title,
      poster_path: posterUrl,
    };

    const videoPlayerData = {
      channel_avatar: this.context.user.additionalUserInfo.profile.picture,
      channel_name: this.context.user.user.displayName,
      comments: [],
      date_posted: datePosted,
      description: description,
      likes: 0,
      materials: materials,
      poster: posterUrl,
      steps: steps,
      video_id: uploadKey,
      video_url: videoUrl,
      video_title: title,
      views: 0,
    };
    const userData = {
      id: uploadKey,
      title: title,
      description: description,
      steps: steps,
      materials: materials,
      poster_url: posterUrl,
      video_url: videoUrl,
      date_created: datePosted,
    };

    const updates = {};
    updates[`/public/video_list/${uploadKey}`] = videoListData;
    updates[`/public/video_player/${uploadKey}`] = videoPlayerData;
    updates[
      `/users/${this.context.user.user.uid}/uploads/${uploadKey}`
    ] = userData;

    firebase.database().ref().update(updates);

    return Alert.alert("upload successful");
  };

  render() {
    const { video, poster, steps, materials } = this.state;
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        onScroll={(event) => this.setScrollPosition(event)}
        ref={(scrollPosition) => {
          this._scrollPosition = scrollPosition;
        }}
      >
        <Text>Upload</Text>
        {video && (
          <Video
            source={{ uri: video.uri }}
            useNativeControls
            style={styles.backgroundVideo}
            // isMuted={false}
          />
        )}
        <View>
          <Text>VIDEO</Text>
          <TouchableOpacity onPress={this.handleChooseVideo} style={styles.btn}>
            <Text style={styles.btnText}>ADD VIDEO</Text>
          </TouchableOpacity>
        </View>
        <View>
          {poster && (
            <Image
              source={{ uri: poster.uri }}
              style={styles.backgroundVideo}
              // isMuted={false}
            />
          )}

          <Text>VIDEO POSTER</Text>
          <TouchableOpacity
            onPress={this.handleChoosePoster}
            style={styles.btn}
          >
            <Text style={styles.btnText}>ADD VIDEO POSTER</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>TITLE</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => this.setState({ title: value })}
            returnKeyType="done"
            enablesReturnKeyAutomatically
            ref={(input) => {
              this.titleInput = input;
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>DESCRIPTION</Text>
          <TextInput
            style={(styles.input, styles.multiline)}
            multiline
            onChangeText={(value) => this.setState({ description: value })}
            returnKeyType="done"
            enablesReturnKeyAutomatically
            ref={(input) => {
              this.descriptionInput = input;
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>STEPS TO FOLLOW</Text>
          {steps.length !== 0 && this.list(steps)}
          <TextInput
            blurOnSubmit={false}
            style={styles.input}
            placeholder="Start with step one"
            onChangeText={(value) => this.setState({ newStep: value })}
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onSubmitEditing={this.addToStep}
            ref={(input) => {
              this.stepsInput = input;
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>REQUIRED MATERIALS</Text>
          {materials.length !== 0 && this.list(materials)}
          <TextInput
            blurOnSubmit={false}
            style={styles.input}
            placeholder="Add the require materials"
            onChangeText={(value) => this.setState({ newMaterial: value })}
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onSubmitEditing={this.addToMaterials}
            ref={(input) => {
              this.materialsInput = input;
            }}
          />
        </View>

        <TouchableOpacity onPress={this.newSubmit} style={styles.btn}>
          <Text style={styles.btnText}>UPLOAD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.clear}
          style={[styles.btn, styles.cancel]}
        >
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    // flex: 1,
  },
  backgroundVideo: {
    // position: "absolute",
    width: "100%",
    height: 210,
    // top: 0,
  },
  btn: {
    backgroundColor: "#3772FF",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginVertical: 8,
  },
  btnText: {
    color: "#fff",
  },
  input: {
    height: 48,
    width: "100%",
    borderRadius: 4,
    borderColor: "grey",
    borderWidth: 2,
    paddingHorizontal: 8,
  },
  inputContainer: {
    paddingVertical: 16,
  },
  multiline: {
    height: 100,
    width: "100%",
    borderRadius: 4,
    borderColor: "grey",
    borderWidth: 2,
    paddingHorizontal: 8,
  },
  listItem: {
    paddingVertical: 16,
    backgroundColor: "white",
  },
  leftAction: {
    // backgroundColor: "red",
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  icon: {
    height: 20,
    width: 20,
  },
  cancel: {
    marginBottom: 56,
    backgroundColor: "white",
    borderColor: "#3772FF",
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  cancelText: {
    color: "#3772FF",
  },
});
