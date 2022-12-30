import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
const { height, width } = Dimensions.get("screen");

const Settings = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.welcomecontainer}>
          <TouchableOpacity
            style={styles.drawerContainer}
            onPress={() => navigation.openDrawer()}
          >
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text>Aloha</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContainer: {
    left: width - 55,
    bottom: 350,
  },
  welcomecontainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
});
export default Settings;
