import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
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
import { SafeAreaView } from "react-native-safe-area-context";

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
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffa45c",
        }}
      >
        <View style={styles.header}>
          <Text style={{ fontSize: 35, fontWeight: "700", color: "white" }}>
            Emergency Contact
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
            backgroundColor: "white",
            paddingTop: 20,
            height: "100%",
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
      </SafeAreaView>
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
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    height: "8%",
  },
  addContact: {
    // left: 80,
    marginTop: 10,
  },
});
export default ContactsScreen;
