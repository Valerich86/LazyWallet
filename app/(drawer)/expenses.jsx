import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { getAll, getTotal } from "../../database/controllers/expenses.js";
import ListEmpty from "../../components/ListEmpty.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import { Colors } from "../../constants/colors.js";
import { exportFile } from "../../services/FileSystem.js";

const Expenses = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result1 = await getAll();
      setData(result1);
      let result2 = await getTotal();
      setTotal(result2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportPress = async () => {
    if (data.length > 0) {
      try {
        await exportFile(data, total);
      } catch (error) {
        console.log(error);
      }
    } else return;
  };

  const ListItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => router.push(`views/expense/info/${item.id}`)}
        style={{
          width: "100%",
          minHeight: 50,
          borderBottomWidth: 1,
          marginBottom: 20,
          marginTop: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 20 }}>{item.category}</Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontStyle: "italic", overflow: "hidden", width: "70%" }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={{ fontWeight: "500" }}>
            {item.sum}
            {item.sign}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontStyle: "italic" }}>
          Всего за месяц:
        </Text>
        <View style={{ flexDirection: "row" }}>
          {total.map((item) => (
            <Text
              adjustsFontSizeToFit
              style={{ fontSize: 17, fontWeight: "500" }}
              key={item.id}
            >
              {" "}
              {item.total}
              {item.sign}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.targetDate}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 25, marginTop: 15 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "500",
                  backgroundColor: "yellow",
                }}
              >
                {new Date(item.targetDate)
                .toLocaleString()
                .substring(0, 10)}
              </Text>
              {item.data.map((obj) => (
                <ListItem item={obj} key={obj.id} />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontStyle: "italic",
                    color: "green",
                  }}
                >
                  ИТОГО:
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {item.totalByCurrency.map((obj) => (
                    <View key={obj.sign}>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: 16,
                          fontWeight: "500",
                          color: "green",
                        }}
                      >
                        {" "}
                        {obj.total}
                        {obj.sign}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => <ListEmpty />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.footer}>
        <CustomButton
          text={"Экспортировать"}
          width={"45%"}
          height={48}
          bgColor={"gray"}
          handlePress={handleExportPress}
        />
        <CustomButton
          text={"Добавить"}
          width={"45%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push("/views/expense/create")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Expenses;

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
    height: "80%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  footer: {
    height: "10%",
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
