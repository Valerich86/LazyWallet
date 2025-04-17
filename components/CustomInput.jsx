import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const CustomInput = ({ header, value, handleChange, type}) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.inputHeader}>{header}</Text>
      <View style={styles.inputView}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholderTextColor={"gray"}
          cursorColor={"gray"}
          style={{ fontSize: 18 }}
          keyboardType={type? type : 'default'}
          maxLength={60}
        />
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputHeader: {
    fontSize: 17,
    fontStyle: "italic",
  },
  inputView: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: "gray",
    backgroundColor: "white",
    opacity: 0.7,
    paddingLeft: 12
  },
});
