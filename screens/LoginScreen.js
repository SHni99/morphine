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
} from "react-native";
import React, { useState, useEffect } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import { authentication } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-root-toast";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(`Signed in with ${user.email}`);
        let toast = Toast.show('Successfully signed in', {
          duration: Toast.durations.SHORT,
          backgroundColor: 'green',
        });
        
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
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="black"
              onChangeText={(email) => setEmail(email)}
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(password) => setPassword(password)}
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
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
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
