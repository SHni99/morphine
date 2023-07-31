import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { authentication, db2, firebase } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-root-toast";
import { ref, set } from "firebase/database";
import FormInput from "../components/input/FormInput";
import PasswordInput from "../components/input/PasswordInput";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const writeUserData = (email, password) => {
    //const newKey = push(child(ref(database), `users`)).key;
    set(ref(db2, "login details/"), {
      email: email,
      password: password,
    })
      .then(() => {
        console.log("successfully stored");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  /* var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
*/
  //var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(`Signed in with ${user.email}`);
        let toast = Toast.show("Successfully signed in", {
          duration: Toast.durations.SHORT,
          backgroundColor: "green",
        });
        writeUserData(email, password);
        setTimeout(function hideToast() {
          Toast.hide(toast);
        }, 1500);
        navigation.navigate("hometab");
      })
      .catch((error) => alert(error.message));
  };

  // auto logs in when user alr has an acc
  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("hometab");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Image source={require("../assets/FG.png")} style={styles.logo} />
        <View style={styles.inputs}>
          <FormInput header={"Email"} onChange={(text) => setEmail(text)} />
          <PasswordInput
            header={"Password"}
            onChange={(text) => setPassword(password)}
          />
        </View>
        <View style={styles.signupcontainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity
            style={styles.signupbutton}
            onPress={() => navigation.navigate("signup")}
          >
            <Text style={styles.signuptext}>Sign up here</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginbutton} onPress={handleLogin}>
          <Text style={styles.logintext}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    // display: "flex",
    alignItems: "center",
  },
  inputs: {
    display: "flex",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 40,
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

  loginbutton: {
    width: 100,
    borderRadius: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#171E4A",
    alignSelf: "center",
  },
  logintext: {
    color: "white",
    fontWeight: "bold",
  },
  signupcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupbutton: {
    marginLeft: 10,
    alignItems: "center",
  },
  signuptext: {
    fontWeight: "bold",
  },
  inputText: {
    padding: 13,
  },
});

export default LoginScreen;
