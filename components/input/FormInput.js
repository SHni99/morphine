import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

const FormInput = ({
  containerStyles,
  header,
  defaultValue,
  onChange,
  error,
  value,
  keyboardType,
}) => {
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
      />
      <Text style={styles.error}>{error}</Text>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
  },
  inputHeader: {
    fontWeight: "500",
  },
  inputText: {
    marginTop: 10,
    padding: 13,
    backgroundColor: "#A3A3BD",
    borderRadius: 15,
    height: 50,
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
