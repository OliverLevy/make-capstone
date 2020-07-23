import React from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { UserContext } from "../Context/UserContext";
import firebase from "firebase";

export default class ProjectList extends React.Component {
  state = {
    projectList: null,
    newProject: null,
  };

  static contextType = UserContext;

  addProject = () => {
    this.textInput.clear();
    const output = this.state.newProject;

    if (this.state.projectList !== null) {
      console.log(2121, this.state.projectList);
    }

    const projectKey = firebase
      .database()
      .ref("/users/")
      .child("project")
      .push().key;
    firebase
      .database()
      .ref("/users/" + this.context.user.user.uid)
      .child(`projects/`)
      .push()
      .update({
        id: projectKey,
        project_name: output,
        date_created: Date.now(),
      });
  };

  componentDidMount() {
    firebase
      .database()
      .ref(`/users/${this.context.user.user.uid}/projects`)
      .on("value", (suc) => {
        this.setState({
          projectList: suc.val(),
        });
        const input = suc.val();
      });
  }

  list = () => {
    if (this.state.projectList !== null) {
      const input = this.state.projectList;
      const keyArr = Object.keys(input);
      const reverseArr = keyArr.reverse();
      return reverseArr.map((id) => {
        let output = input[id];
        return (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Project Item", {
                name: output.project_name,
              })
            }
            key={output.id}
          >
            <View style={styles.projectList}>
              <Text style={styles.h3}>{output.project_name}</Text>
              <Text style={styles.p}>{output.date_created}</Text>
              <Text>{output.id}</Text>
            </View>
          </TouchableOpacity>
        );
      });
    }

    // const output = this.state.projectList.map((item) => {
    //   return <Text>{item}</Text>;
    // });
    // return output.reverse();
  };

  render() {
    console.log(462, this.state.projectList);
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="ADD A NEW PROJECT"
              onChangeText={(value) => this.setState({ newProject: value })}
              returnKeyType="done"
              enablesReturnKeyAutomatically
              clearTextOnFocus
              textAlign="center"
              placeholderTextColor="#3772FF"
              autoCorrect={false}
              onSubmitEditing={this.addProject}
              ref={(input) => {
                this.textInput = input;
              }}
            />
          </View>
          {this.list()}

          <Button
            title="go to project item"
            onPress={() => this.props.navigation.navigate("Project Item")}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    height: 48,
    // width: "60%",
    borderRadius: 4,
    borderColor: "#3772FF",
    borderWidth: 2,
    paddingHorizontal: 8,
    flex: 1,
  },
  btn: {
    height: 48,
    width: 100,
    marginLeft: 16,
    backgroundColor: "#3772FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    // flexGrow: 1
    // flex: 1
  },
  btnText: {
    color: "white",
  },
  projectList: {
    paddingVertical: 16,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
  },
  p: {},
});
