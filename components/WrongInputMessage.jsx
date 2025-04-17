import { StyleSheet, Text, View } from "react-native";
import React from "react";

const WrongInputMessage = ({message}) => {
  return (
    <View>
      <Text
        style={{
          marginTop: 15,
          color: "red",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {message}
      </Text>
    </View>
  );
};

export default WrongInputMessage;

const styles = StyleSheet.create({});
