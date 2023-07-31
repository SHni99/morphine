import { AntDesign } from "@expo/vector-icons";
import { getAuth, updatePassword } from "firebase/auth";
import React, { useState } from "react";
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
import PasswordInput from "../components/input/PasswordInput";
const { width, height } = Dimensions.get("screen");

const ChangePasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState({ password: "", repassword: "" });
  const [isValid, setIsValid] = useState(false);

  function getErrors() {
    const temp = { password: "", repassword: "" };
    if (newPassword.length < 8) {
      temp.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[0-9])/.test(newPassword)) {
      temp.password = "Please enter a password containing at least one NUMBER";
    } else if (!/^(?=.*[A-Z])/.test(newPassword)) {
      temp.password =
        "Please enter a password containing at least one UPPERCASE character";
    } else if (!/^(?=.*[a-z])/.test(newPassword)) {
      temp.password =
        "Please enter a password containing at least one LOWERCASE character";
    } else if (!/^(?=.*[!@#$%^&*])/.test(newPassword)) {
      temp.password =
        "Please enter a password containing at least one SPECIAL CASE";
    } else if (newPassword !== repassword) {
      temp.repassword = "Please enter the SAME passwords!";
    }

    if (newPassword != repassword) {
      temp.repassword = "Passwords do not match";
    }

    return temp;
  }

  const cfmPasswordUpdate = () => {
    const sendDB = async () => {
      await updatePassword(getAuth().currentUser, newPassword)
        .then(
          alert("Success!", "You have successfully changed your password."),
          Keyboard.dismiss(),
          navigation.goBack()
        )
        .catch((e) => console.log(e));
    };
    Alert.alert("Confirm", "Are you sure you want to change your password?", [
      { text: "No" },
      { text: "Yes", onPress: () => sendDB() },
    ]);
  };

  const checkIfValid = (errors) => {
    return errors.password.length === 0 && errors.repassword.length === 0;
  };

  const handleSubmit = () => {
    const tempErrors = getErrors();
    setError(tempErrors);

    if (checkIfValid(tempErrors)) {
      setIsValid(true);
      cfmPasswordUpdate();
    } else {
      setIsValid(false);
    }
  };

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
          <Text style={styles.header}>Update Password</Text>
        </View>
        <View style={styles.inputs}>
          <PasswordInput
            header={"New password"}
            onChange={(text) => setNewPassword(text)}
            value={newPassword}
            error={error.password}
          />
          <PasswordInput
            containerStyles={{ marginTop: 10 }}
            header={"Repeat new password"}
            onChange={(text) => setRepassword(text)}
            value={repassword}
            error={error.repassword}
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

export default ChangePasswordScreen;
