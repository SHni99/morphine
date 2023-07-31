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
const ChangeNumberScreen = ({ route, navigation }) => {
  const { number } = route.params;
  const [newNum, setNewNum] = useState(number);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const getErrors = () => {
    if (newNum.length != 8) {
      return "Phone number must be a valid 8 digit number";
    } else {
      return "";
    }
  };

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

  const checkIfValid = (errors) => {
    return errors.length === 0;
  };

  const handleSubmit = () => {
    const tempErrors = getErrors();
    setError(tempErrors);

    if (checkIfValid(tempErrors)) {
      setIsValid(true);
      cfmNumChange();
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    setError(getErrors());
  }, [newNum]);

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
          <Text style={styles.header}>Update Number</Text>
        </View>
        <View style={styles.inputs}>
          <FormInput
            header={"New number"}
            onChange={(text) => setNewNum(text)}
            value={newNum}
            error={error}
            keyboardType={"numeric"}
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

export default ChangeNumberScreen;
