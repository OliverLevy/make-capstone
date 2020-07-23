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
    poster: null,
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

  handleSubmit = () => {
    const { video, poster, title, description, steps, materials } = this.state;
    const datePosted = Date.now();
    const uploadKey = firebase.database().ref("/users/").child("uploads").push()
      .key;
    // upload video info to the users 'upload'
    firebase
      .database()
      .ref("/users/" + this.context.user.user.uid)
      .child(`uploads/`)
      .push()
      .update({
        id: uploadKey,
        title: title,
        description: description,
        steps: steps,
        materials: materials,
        poster_path: `video_poster/${uploadKey}`,
        video_path: `videos/${uploadKey}`,
        date_created: datePosted,
      });

    //get url for video
    firebase
    .storageRef()
    .child(`videos_poster/${uploadKey}`)
    .getDownloadURL()
    .then(suc => {
      console.log(2306 ,suc)
    })

    // upload to database video_list
    firebase
      .database()
      .ref('/public/')
      .child('video_list/')
      .push()
      .update({
        avatar: this.context.user.additionalUserInfo.profile.picture,
        channel: this.context.user.user.displayName,
        date_posted: datePosted,
        likes: 0,
        views: 0,
        id: uploadKey,
        title: title,
        poster_path: `videos_poster/${uploadKey}`,
      });

    this.uploadVideo(video.uri, uploadKey)
      .then(() => {
        Alert.alert("video upload success");
      })
      .catch((error) => {
        Alert.alert(error);
      });
    this.uploadVideoPoster(poster.uri, uploadKey)
      .then(() => {
        Alert.alert("poster upload success");
      })
      .catch((error) => {
        Alert.alert(error);
      });
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

  uploadVideoPoster = async (uri, videoPosterId) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase
      .storage()
      .ref()
      .child("videos_poster/" + videoPosterId);
    return ref.put(blob);
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

  //if all of these states hold value, upload the state from video, poster, title, description, steps, materials to their respective locations database and storage

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
        <TouchableOpacity onPress={this.handleSubmit} style={styles.btn}>
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
