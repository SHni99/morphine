import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormInput from "../components/input/FormInput";
import { db } from "../firebase/firebase";
const { width, height } = Dimensions.get("screen");
const ChangeNameScreen = ({ route, navigation }) => {
  const { firstName, lastName } = route.params;
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);
  const [errors, setErrors] = useState({ firstError: "", lastError: "" });
  const [isValid, setIsValid] = useState(false);

  const getErrors = () => {
    let temp = { firstError: "", lastError: "" };
    if (newFirstName.length === 0) {
      temp.firstError = "Invalid first name";
    }
    if (newLastName.length === 0) {
      temp.lastError = "Invalid last name";
    }
    return temp;
  };

  const cfmNameChange = () => {
    console.log("changing name");
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

  const checkIfValid = (errors) => {
    console.log(errors);
    return errors.firstError.length === 0 && errors.lastError.length == 0;
  };

  const handleSubmit = () => {
    const tempErrors = getErrors();
    setErrors(tempErrors);

    if (checkIfValid(tempErrors)) {
      setIsValid(true);
      cfmNameChange();
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    setErrors(getErrors());
  }, [newFirstName, newLastName]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Update Name</Text>
        </View>
        <View style={styles.inputs}>
          <FormInput
            header={"First Name"}
            onChange={(text) => setNewFirstName(text)}
            value={newFirstName}
            error={errors.firstError}
          />
          <FormInput
            header={"Last Name"}
            onChange={(text) => setNewLastName(text)}
            defaultValue={lastName}
            error={errors.lastError}
            containerStyles={{ top: 10 }}
          />
        </View>
        <TouchableOpacity
          style={[styles.nameCfmBtn, { backgroundColor: "#43356B" }]}
          onPress={() => handleSubmit()}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Confirm</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputs: {
    display: "flex",
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: "row",
    display: "flex",
    height: "5%",
    alignItems: "center",
  },
  header: {
    fontWeight: "600",
    fontSize: 20,
    marginLeft: 10,
  },
  inputText: {
    padding: 13,
    flex: 1,
    backgroundColor: "#A3A3BD",
    borderRadius: 15,
    height: 50,
  },
  inputHeader: {
    paddingBottom: 5,
    fontWeight: "400",
  },
  inputContainer: {
    width: width - 50,
    marginBottom: 20,
    alignItems: "center",
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
  },
  nameCfmBtn: {
    borderRadius: 20,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
  },
  backBtn: {},
});

export default ChangeNameScreen;
