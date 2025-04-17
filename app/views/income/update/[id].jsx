import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { validate } from "../../../../services/validateValues";
import { getAll } from "../../../../database/controllers/wallets";
import { getAllIncomeCategories} from '../../../../database/controllers/incomeCategories';
import { getOne, update } from "../../../../database/controllers/incomes";
import CustomButton from "../../../../components/CustomButton";
import CustomInput from "../../../../components/CustomInput";
import CustomDropdown from "../../../../components/CustomDropdown";
import DatePicker from "../../../../components/DatePicker";
import WrongInputMessage from "../../../../components/WrongInputMessage";

const Update = () => {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getOne(id);
      setForm({
        title: result.title,
        sum: result.sum.toString(),
        date: result.date,
        category: result.category,
        wallet_id: result.wallet_id,
        description: result.description
      });
      let result1 = await getAll(result.wallet_id);
      setWallets(result1);
      let result2 = await getAllIncomeCategories(result.category);
      setCategories(result2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    let response = validate([
      { value: form.title.trim(), field: "Название" },
      { value: form.sum.toString().trim(), field: "Сумма" },
    ]);
    if (!response.isValid) {
      setMessage(response.message);
      return;
    }

    try {
      await update(id, form);
      router.replace(`/views/income/info/${id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setForm({});
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
          selectedValue={form.category}
          onValueChange={(e) => setForm({...form, category: e.title})}
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

export default Update;
