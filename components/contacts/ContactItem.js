import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ContactItem = ({ item, index, selected }) => {
  const name = item.firstName + " " + item.lastName;
  const mobile = item.mobile.replace(/-|\s/g, "");
  const home = item.home.replace(/-|\s/g, "");
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    if (isSelected) {
      setIsSelected(false);
      if (findIndex(item, selected) >= 0) {
        selected.splice(findIndex(item, selected), 1);
      }
    } else {
      setIsSelected(true);
      selected.push(item);
    }
  };

  const findIndex = (item, selectedArr) => {
    for (let i = 0; i < selectedArr.length; i++) {
      if (
        selectedArr[i].firstName === item.firstName &&
        selectedArr[i].lastName === item.lastName &&
        selectedArr[i].mobile === item.mobile &&
        selectedArr[i].home === item.home
      ) {
        return i;
      }
    }
    return -1;
  };

  return (
    <View
      key={index}
      style={{
        flexDirection: "row",
        marginBottom: 20,
        padding: 10,
        alignItems: "center",
        // backgroundColor: "grey",
        // flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 15,
      }}
    >
      <View style={styles.nameContainer}>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => toggleSelection()}
        >
          {!isSelected ? (
            <Ionicons name="radio-button-off" size={20} color="black" />
          ) : (
            <Ionicons name="radio-button-on-outline" size={20} color="black" />
          )}
        </TouchableOpacity>
        <View style={styles.name}>
          <Text style={{ fontWeight: "bold" }}>{name}</Text>
        </View>
      </View>
      <View style={styles.numbersContainer}>
        {mobile ? <Text>Mobile: {mobile}</Text> : <View></View>}
        {home ? <Text>Home: {home}</Text> : <View></View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectBtn: {
    paddingRight: 8,
  },
  name: {
    width: 120,
  },
  numbersContainer: {
    // left: 190,
  },
});
export default ContactItem;
