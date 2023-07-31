import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ContactsPicker from "../components/contacts/ContactsPicker";
import EmergencyContactItem from "../components/contacts/EmergencyContactItem";
import { db } from "../firebase/firebase";
const { height, width } = Dimensions.get("screen");

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
            // alignItems: "center",
          }}
        >
          {emergencyContacts.length > 0 ? (
            <FlatList
              data={emergencyContacts}
              keyExtractor={(item) => item.index}
              renderItem={({ item, index }) => {
                return (
                  <EmergencyContactItem item={item} index={index} key={index} />
                );
              }}
            />
          ) : (
            <Text style={{ fontSize: 16, color: "grey", textAlign: "center" }}>
              You have not added any emergency contacts
            </Text>
          )}
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
