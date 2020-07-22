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
  KeyboardAvoidingView
} from "react-native";
import { Video, Audio } from "expo-av";
import firebase from "firebase";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { ScrollView } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

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
  };

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
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          video: result,
        })
          // this.uploadVideo(result.uri, "test-img")
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
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({
          poster: result,
        })
          // this.uploadVideo(result.uri, "test-img")
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

  uploadVideo = async (uri, videoTitle) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const ref = firebase
      .storage()
      .ref()
      .child("videos/" + videoTitle);
    return ref.put(blob);
  };

  addToStep = () => {
    this.stepsInput.clear();
    this.setState({
      steps: [...this.state.steps, this.state.newStep],
    });
  };

  addToMaterials = () => {
    this.materialsInput.clear();
    this.setState({
      materials: [...this.state.materials, this.state.newMaterial],
    });
  };

  list = (input) => {
    const list = input;
    return input.map((item, i) => {
      return (
        <Text style={styles.listItem} key={i}>
          {`${i + 1}. `}
          {item}
        </Text>
      );
    });
  };

  render() {
    const { video, poster, steps, materials } = this.state;
    return (
      <View>
      <KeyboardAvoidingView>
        <ScrollView style={styles.container}>
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
            <TouchableOpacity
              onPress={this.handleChooseVideo}
              style={styles.btn}
            >
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
            {steps && this.list(steps)}
            <TextInput
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
            {materials && this.list(materials)}
            <TextInput
              style={styles.input}
              placeholder="add the require materials"
              onChangeText={(value) => this.setState({ newMaterial: value })}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onSubmitEditing={this.addToMaterials}
              ref={(input) => {
                this.materialsInput = input;
              }}
            />
          </View>
          <TouchableOpacity onPress={this.handleChooseVideo} style={styles.btn}>
            <Text style={styles.btnText}>UPLOAD</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleChooseVideo} style={styles.btn}>
            <Text style={styles.btnText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
  },
});
