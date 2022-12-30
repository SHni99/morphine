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
import { Feather } from "@expo/vector-icons";

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
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Feather name="menu" size={24} color="grey" />
            </TouchableOpacity>
          </View>

          {/* delete when done */}
          <View style={{ alignItems: "center", top: 200 }}>
            <TouchableOpacity
              style={{
                // justifyContent: "center",
                // alignContent: "center",
                alignSelf: "center",
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
  },
  welcomecontainer: {
    // left: 40,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
  },
  weclometext: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "500",
  },
  drawertxt: {
    // left: 130,
  },
  mainContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HomeScreen;
