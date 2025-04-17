import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { getAll, getTotal } from "../../database/controllers/wallets.js";
import ListEmpty from "../../components/ListEmpty.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import { Colors } from "../../constants/colors.js";

const Wallets = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getAll();
      setData(result);
      result = await getTotal();
      setTotal(result);
    } catch (error) {
      console.log(error);
    }
  };

  const ListItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => router.push(`views/wallet/info/${item.id}`)}
        style={{
          width: "100%",
          minHeight: 50,
          borderBottomWidth: 1,
          marginBottom: 20,
          marginTop: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 20 }}>{item.title}</Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontStyle: "italic" }}>Текущий баланс - </Text>
          <Text style={{ fontWeight: "500" }}>
            {item.balance} {item.sign}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontStyle: "italic" }}>Всего средств:</Text>
        <View style={{ flexDirection: "row" }}>
          {total.map((item) => (
            <Text
              adjustsFontSizeToFit
              style={{ fontSize: 17, fontWeight: "500" }}
              key={item.id}
            >
              {"   "}
              {item.sum}
              {item.sign}
            </Text>
          ))}
        </View>
      </View>
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
          text={"Добавить кошелёк"}
          widtр={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push("/views/wallet/create")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Wallets;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.header,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    elevation: 3
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
  },
});
