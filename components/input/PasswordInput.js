import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
const PasswordInput = ({
  containerStyles,
  header,
  defaultValue,
  onChange,
  error,
  value,
  keyboardType,
}) => {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={styles.inputHeader}>{header}</Text>
      <TextInput
        style={styles.inputText}
        placeholderTextColor="black"
        defaultValue={defaultValue}
        onChangeText={onChange}
        autoCorrect={false}
        value={value}
        keyboardType={keyboardType}
        secureTextEntry={isHidden}
      />
      <TouchableOpacity
        style={{ position: "absolute", right: 20, bottom: 35 }}
        onPress={() => setIsHidden(!isHidden)}
      >
        {isHidden ? (
          <Ionicons name="eye" size={24} color="black" />
        ) : (
          <Ionicons name="eye-off-outline" size={24} color="black" />
        )}
      </TouchableOpacity>

      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  container: {},
  inputHeader: {
    fontWeight: "500",
  },
  inputText: {
    marginTop: 10,
    padding: 13,
    backgroundColor: "#A3A3BD",
    borderRadius: 15,
    height: 50,
    display: "flex",
    flexDirection: "row",
    paddingRight: 50,
  },
  inputContainer: {
    backgroundColor: "red",
  },
  error: {
    color: "red",
    opacity: 0.8,
    fontWeight: "500",
    marginTop: 5,
    height: 20,
    // marginBottom: r5,
  },
});
