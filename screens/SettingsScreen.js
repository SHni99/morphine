import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db, db2 } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, set } from "firebase/database";
import { TextInput } from "react-native-gesture-handler";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
const { width } = Dimensions.get("screen");

const Settings = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const [on, setOn] = useState("Off");

  const writeButtonStatus = (on) => {
    set(
      ref(db2, "Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/GPS/Button"),
      {
        on: on,
      }
    )
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

  const cfmNameChange = (newName) => {
    const sendDB = () => {
      setDoc(doc(db, "users", user.uid), {
        fName: newFirstName,
        lName: newLastName,
      }).catch((e) => console.log(e));
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
        setEmail(doc.data().email);
        setPhoneNum(doc.data().phoneNum);
      });
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.welcomecontainer}>
          <Text style={styles.headerText}>Your Profile</Text>
          <TouchableOpacity
            style={styles.drawerContainer}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputs}>
          {/* <Text style={styles.inputHeader}>First Name:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              // placeholder={firstName}
              placeholderTextColor="black"
              defaultValue={firstName}
              onChangeText={(text) => setNewFirstName(text)}
              autoCorrect={false}
            />
          </View> */}

          <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>Name</Text>
            <View style={styles.userDataContainer}>
              <Text style={styles.userData}>
                {firstName} {lastName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("changename")}
              // style={{ alignSelf: "center" }}
            >
              <AntDesign name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>Phone Number</Text>
            <View style={styles.userDataContainer}>
              <Text style={styles.userData}>{phoneNum}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("changenum")}>
              <AntDesign name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>Email</Text>
            <View style={styles.emailDataContainer}>
              <Text style={{ color: "grey" }}>{email}</Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>Password</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("changepw")}
              style={{ alignSelf: "center" }}
            >
              <AntDesign name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <Button title={on} onPress={toggleButton} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContainer: {
    // left: width - 55,
    // bottom: 350,
  },
  inputs: {
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 30,
  },
  welcomecontainer: {
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
  },
  header: {},
  headerText: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#A3A3BD",
    borderRadius: 15,
    width: 270,
    height: 50,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 50,
    paddingTop: 20,
    paddingBottom: 10,
    alignSelf: "center",
  },
  inputText: {
    padding: 13,
  },
  inputHeader: {
    paddingBottom: 5,
    fontWeight: "400",
  },
  nameCfmBtn: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    borderRadius: 15,
    paddingBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  changePwBtn: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    borderRadius: 15,
    paddingBottom: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  userData: {
    // position: "absolute",
    // paddingLeft: 220,
    color: "#43356B",
    paddingTop: 7,
  },
  userDataContainer: {
    position: "absolute",
    alignSelf: "center",
    right: 40,
  },
  emailDataContainer: {
    position: "absolute",
    alignSelf: "center",
    right: 0,
    alignContent: "center",
    paddingTop: 7,
  },
});
export default Settings;
