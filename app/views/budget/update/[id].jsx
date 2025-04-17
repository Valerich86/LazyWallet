import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getAllExpenseCategories } from "../../../../database/controllers/expenseCategories";
import { getAll } from "../../../../database/controllers/currencies";
import { update, getOne } from "../../../../database/controllers/budgets";
import { validate } from "../../../../services/validateValues";
import CustomButton from "../../../../components/CustomButton";
import CustomInput from "../../../../components/CustomInput";
import CustomDropdown from "../../../../components/CustomDropdown";
import DatePicker from "../../../../components/DatePicker";
import WrongInputMessage from "../../../../components/WrongInputMessage";
import CustomRadioButton from "../../../../components/CustomRadioButton";

const Update = () => {
  const rbValues = [
    {id: 1, title: 'Все', value: false},
    {id: 2, title: 'Выбрать одну', value: true},
  ];
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(rbValues[0]);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchData();
    getCurrenciesAndCategories();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getOne(id);
      setForm({
        title: result.title,
        sum: result.sum.toString(),
        date_start: result.date_start,
        date_end: result.date_end,
        category: result.category,
        currency_id: result.currency_id,
        description: result.description
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrenciesAndCategories = async () => {
    try {
      let result1 = await getAll();
      let result2 = await getAllExpenseCategories();
      setCurrencies(result1);
      setCategories(result2);
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
      return;s
    }

    if (form.date_start > form.date_end){
      setMessage('Начальная дата не должна превышать конечную');
      return;
    }

    if (selectedItem.value == false){
      setForm({...form, category: 'Все'});
    }

    try {
      await update(id, form);
      router.replace(`/views/budget/info/${id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setForm({});
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ padding: 15}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <DatePicker
          header={"Начало периода"}
          onDaySelect={(d) =>
            setForm({
              ...form,
              date_start: d,
            })
          }
          selectedValue={new Date(form.date_start).toLocaleString().substring(0, 10)}
        />
        <DatePicker
          header={"Конец периода"}
          onDaySelect={(d) =>
            setForm({
              ...form,
              date_end: d,
            })
          }
          selectedValue={new Date(form.date_end).toLocaleString().substring(0, 10)}
        />
        <CustomRadioButton
          text={'Учитывать категории'}
          data={rbValues}
          selectedItem={selectedItem}
          handlePress={(e) => {
            setSelectedItem(e);
            setCategoriesVisible(e.value);
          }}
        />
        {categoriesVisible && (
          <CustomDropdown
            title={"Категория"}
            selectedValue={categories[0]?.title}
            onValueChange={(e) => setForm({ ...form, category: e.title })}
            values={categories}
          />
        )}
        <CustomDropdown
          title={"Валюта"}
          selectedValue={currencies[0]?.title}
          onValueChange={(e) => setForm({ ...form, currency_id: e.id })}
          values={currencies}
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
        </View>
        <CustomButton
          text={"Готово"}
          width={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Update;
