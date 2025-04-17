import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { getOne } from "../../../../database/controllers/budgets.js";
import { removeOneItemFrom } from "../../../../database/management.js";
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
      let result = await removeOneItemFrom("budgets", id);
      if (result) {
        Alert.alert("Бюджет удален!");
        router.replace("/budgets");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: "700" }} width="50%">
          {data.title}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          {data.sum}
          {data.sign}
        </Text>
      </View>
      <View style={styles.content}>
        {data.date_start !== data.date_end && (
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{new Date(data.date_start).toLocaleString().substring(0, 10)} - {new Date(data.date_end).toLocaleString().substring(0, 10)}</Text>
        )}
        {data.date_start === data.date_end && (
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{new Date(data.date_start).toLocaleString().substring(0, 10)}</Text>
        )}
        {data.category !== 'Все' && (
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Учитываются только затраты на категорию "{data.category}".</Text>
        )}
        {data.category === 'Все' && (
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Учитываются все затраты.</Text>
        )}
        {data.description !== "" && (
          <Text style={{ fontSize: 15 }}>{data.description}</Text>
        )}
      </View>
      <View style={styles.footer}>
        <CustomButton
          text={"Редактировать"}
          width={"45%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push(`/views/budget/update/${id}`)}
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
    alignItems: 'center',
  },
});
