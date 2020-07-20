import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ProjectList extends React.Component {

  state = {
    projectList: null
  }

  // addProject = () => {
  //   this.setState({
  //     projectList: e.
  //   })
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text>this is the project list page</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="NEW PROJECT NAME" />
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        </View>
  
        <Button
          title="go to project item"
          onPress={() => this.props.navigation.navigate("Project Item")}
        />
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
    flex: 1
  },
  btn: {
    height: 48,
    width: 120,
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
});
