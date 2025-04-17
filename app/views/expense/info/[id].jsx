import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getOne, remove } from "../../../../database/controllers/expenses.js";
import CustomButton from "../../../../components/CustomButton.jsx";
import { Colors } from "../../../../constants/colors.js";

const Info = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getOne(id);
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      let result = await remove(id, data);
      if (result) {
        Alert.alert("Расход удален!");
        router.replace("/expenses");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text
          style={{ fontSize: 20, fontWeight: "700" }}
          width='50%'
        >
          {data.category ? data.category : ''}
        </Text>
        <Text
          style={{ fontSize: 20, fontWeight: "700" }}
        >
          {data.sum}
          {data.sign}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          {new Date(data.date).toLocaleString().substring(0, 10)}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "500" }}>
          {data.title}
        </Text>
        {data.description !== '' && <Text style={{ fontSize: 15 }}>{data.description}</Text>}
      </View>
      <View style={styles.footer}>
        <CustomButton
          text={"Редактировать"}
          width={"45%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push(`/views/expense/update/${id}`)}
        />
        <CustomButton
          text={"Удалить"}
          width={"45%"}
          height={48}
          bgColor={"red"}
          handlePress={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.header,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
  },
  content: {
    height: "76%",
    padding: 15,
  },
  footer: {
    height: "10%",
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
