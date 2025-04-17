import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllIncomeCategories } from "../../database/controllers/incomeCategories.js";
import { getAllExpenseCategories } from "../../database/controllers/expenseCategories.js";
import { removeOneItemFrom } from "../../database/management.js";
import CustomButton from "../../components/CustomButton.jsx";

const Categories = () => {
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchData();
  }, [reload]);

  const fetchData = async () => {
    try {
      let result = await getAllIncomeCategories();
      setIncomeCategories(result);
      result = await getAllExpenseCategories();
      setExpenseCategories(result);
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (item, type) => {
    try {
      if (type == 'income'){
        await removeOneItemFrom('incomeCategories', item.id);
      } else {
        await removeOneItemFrom('expenseCategories', item.id);
      }
      Alert.alert(`Категория "${item.title}" удалена`);
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  }

  const ListItem = ({ item, type }) => {
    return (
      <View
        onPress={() => router.push(`views/income/info/${item.id}`)}
        style={{
          width: "100%",
          minHeight: 30,
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 20, fontStyle: 'italic' }}>{item.title}</Text>
        <TouchableOpacity style={{marginLeft: 20}} onPress={() => removeItem(item, type)}>
          <MaterialIcons name="delete" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Категории доходов</Text>
        {incomeCategories.map((item) => <ListItem item={item} type={'income'} key={item.id}/>)}
        <Text style={styles.text}>Категории расходов</Text>
        {expenseCategories.map((item) => <ListItem item={item} type={'expense'} key={item.id}/>)}
      </ScrollView>
      <View style={styles.footer}>
        <CustomButton
          text={"Добавить категорию доходов"}
          width={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push("/views/category/addIncomeCategory")}
        />
        <View style={{ marginTop: 15 }}>
          <CustomButton
            text={"Добавить категорию расходов"}
            width={"100%"}
            height={48}
            bgColor={"green"}
            handlePress={() => router.push("/views/category/addExpenseCategory")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  content: {
    height: "83%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  footer: {
    height: "17%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    backgroundColor: 'yellow'
  }
});
