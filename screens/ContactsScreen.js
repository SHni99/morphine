import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import MapView from "react-native-maps";
import Map from "../components/Map";
import { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import ContactsPicker from "../components/contacts/ContactsPicker";
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import { SwipeListView } from "react-native-swipe-list-view";
import EmergencyContactItem from "../components/contacts/EmergencyContactItem";
const { height, width } = Dimensions.get("screen");
import { AntDesign } from "@expo/vector-icons";

const ContactsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const toggleModal = (bool) => {
    setIsModalVisible(bool);
  };

  useEffect(() => {
    const getEmergencyContacts = async () => {
      const q = query(
        collection(db, "users", getAuth().currentUser.uid, "emergencyContacts")
      );
      onSnapshot(q, (querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((doc) => {
          temp.push(doc.data());
        });
        setEmergencyContacts(temp);
      });
    };
    getEmergencyContacts();
  }, [!isModalVisible]);
  return (
    <View
      style={{
        flex: 1,
        alignContent: "center",
      }}
    >
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", fontSize: 25, letterSpacing: -1 }}>
          Emergency Contacts
        </Text>
        <TouchableOpacity
          onPress={() => toggleModal(true)}
          style={styles.addContact}
        >
          <AntDesign name="adduser" size={24} color="grey" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          marginTop: 80,
          marginBottom: 50,
        }}
      >
        <FlatList
          data={emergencyContacts}
          keyExtractor={(item) => item.index}
          renderItem={({ item, index }) => {
            return (
              <EmergencyContactItem item={item} index={index} key={index} />
            );
          }}
        />
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="overFullScreen"
      >
        <ContactsPicker
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          emergencyContacts={emergencyContacts}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 60,
    // left: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
  },
  addContact: {
    // left: 80,
  },
});
export default ContactsScreen;
