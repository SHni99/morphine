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
    <View
      key={item.index + mobile}
      style={{
        flexDirection: "row",
        marginBottom: 20,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f7efe9",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 25,
        height: 60,
      }}
    >
      <Text>
        {item.firstName} {item.lastName}
      </Text>
      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => removeEmergency()}
        >
          <MaterialIcons name="delete" size={22} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn} onPress={() => triggerCall()}>
          <Ionicons name="call" size={20} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  callBtn: {},
  btns: {
    flexDirection: "row",
  },
  deleteBtn: {
    marginRight: 20,
  },
});
export default EmergencyContactItem;
