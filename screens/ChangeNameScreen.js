import {
  View,
  Text,
  KeyboardAvoidingViewBase,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
const { width, height } = Dimensions.get("screen");
import { AntDesign } from "@expo/vector-icons";

const ChangeNameScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  const cfmNameChange = () => {
    const sendDB = () => {
      updateDoc(
        doc(db, "users", getAuth().currentUser.uid),
        {
          fName: newFirstName,
          lName: newLastName,
        },
        Alert.alert("Success!", "You have successfully changed your name."),
        Keyboard.dismiss(),
        navigation.goBack()
      ).catch((e) => console.log(e));
    };
    Alert.alert("Confirm", "Are you sure you want to change your name?", [
      { text: "No" },
      { text: "Yes", onPress: () => sendDB() },
    ]);
  };

  useEffect(() => {
    const fetchUserData = () => {
      const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
      onSnapshot(usersDocRef, (doc) => {
        setFirstName(doc.data().fName);
        setLastName(doc.data().lName);
        setNewFirstName(firstName);
        setNewLastName(lastName);
      });
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Update Name</Text>
        </View>
        <View style={styles.inputs}>
          <Text style={styles.inputHeader}>First Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={firstName}
              placeholderTextColor="black"
              defaultValue={firstName}
              onChangeText={(text) => setNewFirstName(text)}
              autoCorrect={false}
            />
          </View>
          <Text style={styles.inputHeader}>Last Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={lastName}
              defaultValue={lastName}
              placeholderTextColor="black"
              onChangeText={(text) => setNewLastName(text)}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.nameCfmBtn,
              newFirstName + newLastName === firstName + lastName ||
              newFirstName.length === 0 ||
              newLastName.length === 0
                ? { backgroundColor: "grey" }
                : { backgroundColor: "#43356B" },
            ]}
            disabled={
              newFirstName + newLastName === firstName + lastName ||
              newFirstName.length === 0 ||
              newLastName.length === 0
                ? true
                : false
            }
            onPress={() => cfmNameChange()}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputs: {
    justifyContent: "center",
    alignSelf: "center",
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
  },
  header: {
    fontWeight: "500",
    fontSize: 18,
    // letterSpacing: -1,
  },
  inputText: {
    padding: 13,
  },
  inputHeader: {
    paddingBottom: 5,
    fontWeight: "400",
  },
  inputContainer: {
    backgroundColor: "#A3A3BD",
    borderRadius: 15,
    width: width - 50,
    height: 50,
    marginBottom: 20,
    // alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },
  nameCfmBtn: {
    position: "absolute",
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    width: width - 50,
    alignItems: "center",
    height: 50,
    top: height - 180,
  },
  backBtn: {
    position: "absolute",
    alignSelf: "center",
    left: 20,
    top: 10,
  },
});

export default ChangeNameScreen;
