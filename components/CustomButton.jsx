import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ text, width, height, bgColor, handlePress }) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        height: height,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        borderBottomWidth: 2
      }}
      onPress={handlePress}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
