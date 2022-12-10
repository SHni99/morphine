import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
const { height, width } = Dimensions.get("screen");
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  // get current user's info
  useEffect(() => {
    const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
    onSnapshot(usersDocRef, (doc) => {
      setUser(doc.data());
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View>
          <View style={styles.welcomecontainer}>
            <Text style={styles.weclometext}>
              Welcome {user ? user.fName : ""}
            </Text>
            <TouchableOpacity style={styles.settingBtn}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* delete when done */}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("login");
            }}
          >
            <Text>Go back</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
          onPress={() => {
            getAuth().currentUser.delete();
          }}
        >
          <Text>Delete acc</Text>
        </TouchableOpacity> */}
          <View style={styles.mainContainer}>
            <Text>Battery Percentage of device here</Text>
            <Text>Maybe recent contacts here as well</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomecontainer: {
    display: "flex",
    bottom: 280,
    flexDirection: "row",
    // backgroundColor: "grey",
    width: "100%",
    alignItems: "center",
  },
  weclometext: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "500",
    marginRight: 100,
  },
  drawertxt: {
    // left: 130,
  },
  mainContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  settingBtn: {
    left: 12,
  },
});
export default HomeScreen;
