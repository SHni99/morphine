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

const ChangeNumberScreen = ({ navigation }) => {
  const [num, setNum] = useState("");
  const [newNum, setNewNum] = useState("");

  const cfmNumChange = () => {
    const sendDB = () => {
      updateDoc(
        doc(db, "users", getAuth().currentUser.uid),
        {
          phoneNum: newNum,
        },
        Alert.alert("Success!", "You have successfully changed your number."),
        Keyboard.dismiss(),
        navigation.goBack()
      ).catch((e) => console.log(e));
    };
    Alert.alert("Confirm", "Are you sure you want to change your number?", [
      { text: "No" },
      { text: "Yes", onPress: () => sendDB() },
    ]);
  };

  useEffect(() => {
    const fetchUserData = () => {
      const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
      onSnapshot(usersDocRef, (doc) => {
        setNewNum(doc.data().phoneNum);
        setNum(doc.data().phoneNum);
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
          <Text style={styles.header}>Update Number</Text>
        </View>
        <View style={styles.inputs}>
          <Text style={styles.inputHeader}>New Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              //   placeholder={firstName}
              placeholderTextColor="black"
              //   defaultValue={firstName}
              onChangeText={(text) => setNewNum(text)}
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.numCfmBtn,
              newNum === num || newNum.length === 0
                ? { backgroundColor: "grey" }
                : { backgroundColor: "#43356B" },
            ]}
            disabled={newNum === num || newNum.length === 0 ? true : false}
            onPress={() => cfmNumChange()}
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
  numCfmBtn: {
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

export default ChangeNumberScreen;
