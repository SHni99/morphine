import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState } from "react";
import { db2 } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, set } from "firebase/database";
const { width } = Dimensions.get("screen");

const Settings = ({ navigation }) => {
  const [on, setOn] = useState("Off");

  const writeButtonStatus = (on) => {
    set(ref(db2, "Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/GPS/Button"), {
      on: on
    })
      .then(() => {
        console.log("Success!");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const toggleButton = () => {
    if (on == "On") {
      setOn("Off");
      writeButtonStatus(on);
    } else {
      setOn("On");
      writeButtonStatus(on);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.welcomecontainer}>
          <TouchableOpacity
            style={styles.drawerContainer}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Button title={on} onPress={toggleButton} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContainer: {
    left: width - 55,
    bottom: 350,
  },
  welcomecontainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
});
export default Settings;
