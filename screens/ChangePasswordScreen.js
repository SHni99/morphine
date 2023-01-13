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

const ChangePasswordScreen = ({ navigation }) => {
  const [pw, setPw] = useState("");
  const [currPw, setCurrPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newNewPw, setNewNewPw] = useState("");

  const cfmNameChange = () => {
    // const sendDB = () => {
    //   updateDoc(
    //     doc(db, "users", getAuth().currentUser.uid),
    //     {
    //       fName: newFirstName,
    //       lName: newLastName,
    //     },
    //     Alert.alert("Success!", "You have successfully changed your name."),
    //     Keyboard.dismiss(),
    //     navigation.goBack()
    //   ).catch((e) => console.log(e));
    // };
    // Alert.alert("Confirm", "Are you sure you want to change your name?", [
    //   { text: "No" },
    //   { text: "Yes", onPress: () => sendDB() },
    // ]);
  };

  useEffect(() => {
    const fetchUserData = () => {
      //   const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
      //   onSnapshot(usersDocRef, (doc) => {
      //     setFirstName(doc.data().fName);
      //     setLastName(doc.data().lName);
      //     setNewFirstName(firstName);
      //     setNewLastName(lastName);
      //   });
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
          <Text style={styles.header}>Update Password</Text>
        </View>
        <View style={styles.inputs}>
          <Text style={styles.inputHeader}>Current password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={firstName}
              placeholderTextColor="black"
              //   defaultValue={firstName}
              onChangeText={(text) => setCurrPw(text)}
              autoCorrect={false}
            />
          </View>
          <Text style={styles.inputHeader}>New password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={lastName}
              //   defaultValue={lastName}
              placeholderTextColor="black"
              onChangeText={(text) => setNewPw(text)}
              autoCorrect={false}
            />
          </View>
          <Text style={styles.inputHeader}>Repeat new password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={lastName}
              //   defaultValue={lastName}
              placeholderTextColor="black"
              onChangeText={(text) => setNewNewPw(text)}
              autoCorrect={false}
            />
          </View>
          {/* <TouchableOpacity
            style={[
              styles.pwCfmBtn,
              new
                ? { backgroundColor: "grey" }
                : { backgroundColor: "#43356B" },
            ]}
            disabled={
              newFirstName + newLastName === firstName + lastName ? true : false
            }
            onPress={() => cfmNameChange()}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Confirm</Text>
          </TouchableOpacity> */}
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
    // flex: 1,
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
    textAlign: "left",
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
    paddingLeft: 10,
    // alignItems: "center",
    justifyContent: "center",
  },
  pwCfmBtn: {
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

export default ChangePasswordScreen;
