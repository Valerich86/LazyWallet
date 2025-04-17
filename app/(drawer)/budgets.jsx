import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { getAllBudgets } from "../../database/controllers/budgets.js";
import ListEmpty from "../../components/ListEmpty.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import { Colors } from "../../constants/colors.js";

const Budgets = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getAllBudgets();
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const ListItem = ({ item }) => {
    const dateStart = new Date(item.date_start);
    const dateEnd = new Date(item.date_end);
    const today = new Date();
    let diffInSecs = dateEnd.getTime() - dateStart.getTime();
    if (dateStart <= today && today <= dateEnd){
      diffInSecs = dateEnd.getTime() - today.getTime();
    } 
    let period = Math.round(diffInSecs / (1000 * 3600 * 24)) + 1;
    let oneDayLimit = Math.round((item.sum - item.spent) / period);

    return (
      <Pressable
        onPress={() => router.push(`views/budget/info/${item.id}`)}
        style={{
          width: "100%",
          minHeight: 50,
          borderBottomWidth: 1,
          marginBottom: 20,
          marginTop: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }}>{item.title}</Text>
        {item.date_start !== item.date_end && 
          <Text style={{ fontSize: 18 }}>{new Date(item.date_start).toLocaleString().substring(0, 10)} - {new Date(item.date_end).toLocaleString().substring(0, 10)}</Text>
        }
        {item.date_start === item.date_end && 
          <Text style={{ fontSize: 18 }}>{new Date(item.date_start).toLocaleString().substring(0, 10)}</Text>
        }
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Сумма - </Text>
          <Text style={{ fontWeight: "500" }}>
            {item.sum} {item.sign}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Потрачено - </Text>
          <Text style={[{ fontWeight: "500"}, ((item.sum - item.spent) > 0) ? {color: 'green'} : {color: 'red'} ]}>
            {item.spent} {item.sign}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Осталось - </Text>
          <Text style={[{ fontWeight: "500"}, ((item.sum - item.spent) > 0) ? {color: 'green'} : {color: 'red'} ]}>
            {item.sum - item.spent} {item.sign}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Лимит на день - </Text>
          <Text style={[{ fontWeight: "500"}, (oneDayLimit > 0) ? {color: 'green'} : {color: 'red'} ]}>
            {oneDayLimit} {item.sign}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem item={item} />}
          ListEmptyComponent={() => <ListEmpty />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.footer}>
        <CustomButton
          text={"Добавить бюджет"}
          widtр={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push("/views/budget/create")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Budgets;

const styles = StyleSheet.create({
  content: {
    height: "90%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  footer: {
    height: "10%",
    paddingLeft: 15,
    paddingRight: 15,
  },
});
