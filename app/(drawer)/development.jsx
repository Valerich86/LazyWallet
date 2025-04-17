import { View, Button, Alert } from "react-native";
import React, {useState} from "react";
import { router } from "expo-router";
import { deleteDb, createTablesIfNotExists } from "../../database/management.js";
import { addWallet } from "../../database/controllers/wallets.js";
import { addExpense } from "../../database/controllers/expenses.js";
import { addIncome } from "../../database/controllers/incomes.js";

const Development = () => {
  const walletsTestData = [
    {title: 'Дебетовая карта Сбербанк', balance: 300, currency_id: 1},
    {title: 'Валютный счет', balance: 150, currency_id: 4},
  ];

  const incomesTestData = [
    {title: 'Зачисление зарплаты', wallet_id: 1, sum: 35000, category: 'Зарплата', date: '2025-04-07', description: ''},
    {title: 'Продажа товара на Авито', wallet_id: 1, sum: 1000, category: 'Доход от продажи', date: '2025-04-12', description: 'Продажа лобзика'},
  ];

  const expensesTestData = [
    {title: 'Покупка продуктов', wallet_id: 1, sum: 680, category: 'Питание', date: '2025-04-08', description: 'Магазин Чижик'},
    {title: 'Кошкина еда', wallet_id: 1, sum: 340, category: 'Домашние животные', date: '2025-04-08', description: ''},
    {title: 'Заказ продуктов', wallet_id: 1, sum: 2950, category: 'Питание', date: '2025-04-09', description: 'Магазин Магнит'},
    {title: 'Заказ продуктов', wallet_id: 1, sum: 540, category: 'Питание', date: '2025-04-10', description: 'Заказ в Самокате'},
    {title: 'Покупка продуктов', wallet_id: 1, sum: 2110, category: 'Питание', date: '2025-04-10', description: 'Магазин Лента'},
    {title: 'За квартиру', wallet_id: 1, sum: 9300, category: 'Коммунальные услуги', date: '2025-04-11', description: ''},
    {title: 'Лекарства для меня', wallet_id: 1, sum: 780, category: 'Здоровье', date: '2025-04-11', description: ''},
    {title: 'Покупка штаны-карго', wallet_id: 1, sum: 2800, category: 'Одежда', date: '2025-04-14', description: 'Заказ на Wildberries'},
    {title: 'Отдых на природе', wallet_id: 1, sum: 4500, category: 'Развлечение', date: '2025-04-16', description: 'Еда, напитки'},
    {title: 'Покупка футболка Продиджи', wallet_id: 1, sum: 1380, category: 'Одежда', date: '2025-04-20', description: 'Заказ на Wildberries'},
  ];

  const addTestData = async () => {
    try {
      for (let i = 0; i < walletsTestData.length; i++){
        await addWallet(walletsTestData[i], true);
      }
      for (let i = 0; i < incomesTestData.length; i++){
        await addIncome(incomesTestData[i]);
      }
      for (let i = 0; i < expensesTestData.length; i++){
        await addExpense(expensesTestData[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View
      style={{ justifyContent: "space-around", alignItems: "center", height: "100%" }}
    >
      <Button
        title="Перезапустить базу данных"
        onPress={async () => {
          try {
            await deleteDb();
            Alert.alert("База перезапущена");
          } catch (error) {
            console.log(error);
          }
        }}
      />
      <Button
        title="Добавить таблицы"
        onPress={async () => {
          try{
            await createTablesIfNotExists();
            Alert.alert("Таблицы добавлены");
          } catch (error){
            console.log(error);
          }
        }}
      />
      <Button
        title="Добавить тестовые данные"
        onPress={async () => {
          await addTestData();
        }}
      />
    </View>
  );
};

export default Development;


