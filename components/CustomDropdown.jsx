import { Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const CustomDropdown = ({
  title,
  selectedValue,
  onValueChange,
  values,
}) => {

  return (
    <>
      <Text style={{ fontSize: 17, fontStyle: "italic" }}>{title}</Text>
      <View
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderBottomWidth: 2,
          borderRadius: 5,
          height: 48,
          opacity: 0.7,
          borderColor: "gray",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          mode="dropdown"
        >
          {values.map((item) => (
            <Picker.Item
              key={item.id}
              label={item.title}
              value={item}
            />
          ))}
        </Picker>
      </View>
    </>
  );
};

export default CustomDropdown;
