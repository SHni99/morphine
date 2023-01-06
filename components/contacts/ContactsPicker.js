import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
const { height, width } = Dimensions.get("screen");
import * as Contacts from "expo-contacts";
import ContactItem from "./ContactItem";
import { issuedAtTime } from "@firebase/util";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const ContactsPicker = (props) => {
  const [allContacts, setAllContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [input, setInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const closeModal = () => {
    props.toggleModal(false);
  };

  const reformatContacts = (arr) => {
    var contacts = [];
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i].phoneNumbers);
      if (checkIfBothNumsExists(arr[i].phoneNumbers)) {
        contacts.push({
          firstName: arr[i].firstName,
          lastName: arr[i].lastName ? arr[i].lastName : "",
          mobile: getNumber(arr[i].phoneNumbers, "mobile"),
          home: getNumber(arr[i].phoneNumbers, "home"),
        });
      } else {
      }
    }
    return contacts;
  };

  const getNumber = (contactNumbers, type) => {
    for (let i = 0; i < contactNumbers.length; i++) {
      if (contactNumbers[i].label === type) {
        return contactNumbers[i].number;
      }
    }
    return "";
  };

  const checkIfBothNumsExists = (contact) => {
    if (contact) {
      for (let i = 0; i < contact.length; i++) {
        if (contact[i].label === "mobile" || contact[i].label === "home") {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  };

  const searchFilter = (input) => {
    if (input) {
      if (Number(input)) {
        // search phone number
        const newData = allContacts.filter((item) => {
          const itemData =
            item.mobile || item.home
              ? item.mobile.replace(/-|\s/g, "") ||
                item.home.replace(/-|\s/g, "")
              : "";
          const textData = input.replace(/-|\s/g, "");
          return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
        setInput(input);
      } else {
        // search name
        const newData = allContacts.filter((item) => {
          const itemData =
            item.firstName + item.lastName
              ? (item.firstName + item.lastName)
                  .replace(/-|\s/g, "")
                  .toUpperCase()
              : "";
          const textData = input.replace(/-|\s/g, "").toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
        setInput(input);
      }
    } else {
      setFilteredData(allContacts);
      setInput(input);
    }
  };

  const confirm = () => {
    // check the selected to see if there are no repeats
    if (selected.length === 0) {
      Alert.alert("You have not selected any contact!");
    } else {
      const checkForRepeats = (selected, emergency) => {
        var repeatedNames = [];
        for (let i = 0; i < selected.length; i++) {
          for (let j = 0; j < emergency.length; j++) {
            if (isSameContact(emergency[j], selected[i])) {
              repeatedNames.push(
                selected[i].firstName + " " + selected[i].lastName
              );
            }
          }
        }
        return repeatedNames;
      };
      var repeats = checkForRepeats(selected, props.emergencyContacts);
      if (repeats.length === 0) {
        // no repeats, send to db
        selected.forEach((i) => {
          var docRef = (i.firstName + i.lastName).replace(/-|\s/g, "");
          setDoc(
            doc(
              db,
              "users",
              getAuth().currentUser.uid,
              "emergencyContacts",
              docRef
            ),
            i
          ).catch((e) => console.log(e));
          closeModal();
        });
      } else {
        repeats = repeats.join("\n");
        Alert.alert(
          "Repeat",
          "Contacts have already been added as emergency: \n" + repeats
        );
      }
    }
  };

  const isSameContact = (item, another) => {
    if (
      item.firstName === another.firstName &&
      item.lastName === another.lastName &&
      item.mobile === another.mobile &&
      item.home === item.home
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const getAllContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
            Contacts.Fields.PhoneNumbers,
          ],
        });

        if (data.length > 0) {
          setAllContacts(reformatContacts(data));
          setFilteredData(reformatContacts(data));
        } else {
          console.log(e);
        }
      } else {
        console.log(e);
      }
    };
    getAllContacts();
  }, []);

  return (
    <View style={{ flex: 1, alignContent: "center" }}>
      <View style={styles.header}>
        <Text style={{ fontWeight: "500", fontSize: 20, letterSpacing: -1 }}>
          Select Contact
        </Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => closeModal()}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search contact.."
        onChangeText={(txt) => searchFilter(txt)}
        value={input}
      />
      <View
        style={{
          flex: 1,
          marginTop: 80,
          marginBottom: 50,
        }}
      >
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.index}
          renderItem={({ item, index }) => {
            return (
              <ContactItem
                item={item}
                index={index}
                key={index}
                selected={selected}
              />
            );
          }}
        />
      </View>
      <TouchableOpacity style={styles.confirmBtn} onPress={() => confirm()}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Confirm</Text>
      </TouchableOpacity>
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
  searchBar: {
    top: 70,
    width: width - 30,
    alignSelf: "center",
    height: 35,
    borderRadius: 15,
    borderColor: "grey",
    borderWidth: 0.8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  confirmBtn: {
    alignSelf: "center",
    bottom: 40,
    backgroundColor: "#43356B",
    width: 140,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ContactsPicker;
