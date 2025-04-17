import { StyleSheet, Text, View, Pressable } from "react-native";
import React, {useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CustomRadioButton = ({ text, data, selectedItem, handlePress }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.header}>{text}</Text>
      <View style={styles.container}>
        {data.map((item) => (
          <Pressable onPress={() => handlePress(item)} key={item.id} style={{alignItems: 'center', flex: 0.4}}>
            <Text>{item.title}</Text>
            {selectedItem.title !== item.title && (
              <MaterialIcons name="radio-button-off" size={24} color="gray" />
            )}
            {selectedItem.title === item.title && (
              <MaterialIcons name="radio-button-on" size={24} color="gray" />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default CustomRadioButton;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 17,
    fontStyle: "italic",
  },
  container: {
    width: "100%",
    height: 48,
    opacity: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
});
