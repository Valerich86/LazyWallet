import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} />
      <Stack.Screen 
        name="(drawer)" 
        options={{ headerShown: false }} />
      <Stack.Screen
        name="views/wallet/create"
        options={{ headerTitle: "Новый счёт" }}
      />
      <Stack.Screen
        name="views/wallet/info/[id]"
        options={{ headerTitle: "Счёт" }}
      />
      <Stack.Screen
        name="views/wallet/update/[id]"
        options={{ headerTitle: "Редактирование" }}
      />
      <Stack.Screen
        name="views/income/create"
        options={{ headerTitle: "Новое поступление" }}
      />
      <Stack.Screen
        name="views/income/info/[id]"
        options={{ headerTitle: "Поступление средств" }}
      />
      <Stack.Screen
        name="views/income/update/[id]"
        options={{ headerTitle: "Редактирование" }}
      />
      <Stack.Screen
        name="views/expense/create"
        options={{ headerTitle: "Новый расход" }}
      />
      <Stack.Screen
        name="views/expense/info/[id]"
        options={{ headerTitle: "Расход" }}
      />
      <Stack.Screen
        name="views/expense/update/[id]"
        options={{ headerTitle: "Редактирование" }}
      />
      <Stack.Screen
        name="views/category/addIncomeCategory"
        options={{ headerTitle: "Добавление категории дохода" }}
      />
      <Stack.Screen
        name="views/category/addExpenseCategory"
        options={{ headerTitle: "Добавление категории расхода" }}
      />
      <Stack.Screen
        name="views/budget/create"
        options={{ headerTitle: "Новый бюджет" }}
      />
      <Stack.Screen
        name="views/budget/info/[id]"
        options={{ headerTitle: "Бюджет" }}
      />
      <Stack.Screen
        name="views/budget/update/[id]"
        options={{ headerTitle: "Редактирование" }}
      />
    </Stack>
  );
}
