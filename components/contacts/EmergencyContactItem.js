import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const EmergencyContactItem = ({ item, index }) => {
  const name = item.firstName + " " + item.lastName;
  const mobile = item.mobile.replace(/-|\s/g, "");
  const home = item.home.replace(/-|\s/g, "");
  const removeEmergency = (item) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove " + name + " from emergency contacts?",
      [{ text: "Cancel" }, { text: "Ok", onPress: () => deleteDB() }]
    );

    const deleteDB = async () => {
      await deleteDoc(
        doc(
          db,
          "users",
          getAuth().currentUser.uid,
          "emergencyContacts",
          name.replace(/\s+/, "")
        )
      ).catch((e) => console.log(e));
    };
  };

  const triggerCall = () => {
    const url = mobile ? "tel://" + mobile : "tell://" + home;
    Linking.openURL(url).catch((e) => console.log(e));
  };
  return (
    <View key={name + mobile}>
      <View style={styles.container}>
        <Text style={{ fontWeight: "500" }}>
          {item.firstName} {item.lastName}
        </Text>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeEmergency()}
          >
            <MaterialIcons name="delete" size={22} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => triggerCall()}
          >
            <Ionicons name="call" size={20} color="#ACBDA3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#faece1",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  callBtn: {},
  btns: {
    flexDirection: "row",
  },
  deleteBtn: {
    marginRight: 20,
  },
});
export default EmergencyContactItem;
