import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { getAllExpenseCategories } from "../../../database/controllers/expenseCategories";
import { getAll } from "../../../database/controllers/wallets";
import { addExpense } from "../../../database/controllers/expenses";
import { validate } from "../../../services/validateValues";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomDropdown from "../../../components/CustomDropdown";
import DatePicker from "../../../components/DatePicker";
import WrongInputMessage from "../../../components/WrongInputMessage";

const Create = () => {
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    wallet_id: 1,
    sum: 0,
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result1 = await getAll();
      let result2 = await getAllExpenseCategories();
      setWallets(result1);
      setCategories(result2);
      setForm({ ...form, category: result2[0].title, wallet_id: result1[0].id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    let response = validate([
      { value: form.title.trim(), field: "Короткое описание" },
      { value: form.sum.toString().trim(), field: "Сумма" },
    ]);
    if (!response.isValid) {
      setMessage(response.message);
      return;
    }

    try {
      await addExpense(form);
      router.replace("/expenses");
    } catch (error) {
      console.log(error);
    } finally {
      setForm({
        title: "",
        wallet_id: 1,
        sum: 0,
        category: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CustomDropdown
          title={"Категория"}
          selectedValue={categories[0]?.title}
          onValueChange={(e) => setForm({ ...form, category: e.title })}
          values={categories}
        />
        <DatePicker
          header={"Дата"}
          onDaySelect={(d) =>
            setForm({
              ...form,
              date: d,
            })
          }
          selectedValue={new Date(form.date).toLocaleString().substring(0, 10)}
        />
        <CustomDropdown
          title={"Кошелёк"}
          selectedValue={{}}
          onValueChange={(e) => setForm({ ...form, wallet_id: e.id })}
          values={wallets}
        />
        <CustomInput
          header={"Сумма"}
          value={form.sum}
          handleChange={(e) => setForm({ ...form, sum: e })}
          type={"decimal-pad"}
        />
        <CustomInput
          header={"Короткое описание"}
          value={form.title}
          handleChange={(e) => setForm({ ...form, title: e })}
        />
        <CustomInput
          header={"Подробное описание (не обязательно)"}
          value={form.description}
          handleChange={(e) => setForm({ ...form, description: e })}
        />
        {message && <WrongInputMessage message={message} />}
        <View style={{ marginTop: 25 }}>
          <CustomButton
            text={"Готово"}
            width={"100%"}
            height={48}
            bgColor={"green"}
            handlePress={handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
