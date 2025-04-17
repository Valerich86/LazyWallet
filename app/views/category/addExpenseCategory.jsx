import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import { addExpenseCategory } from "../../../database/controllers/expenseCategories";
import { validate } from "../../../services/validateValues";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import WrongInputMessage from "../../../components/WrongInputMessage";

const AddExpenseCategory = () => {
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({title: ""});

  const handleSubmit = async () => {
    let response = validate([
      { value: form.title.trim(), field: "Название" }
    ]);
    if (!response.isValid) {
      setMessage(response.message);
      return;
    }

    try {
      await addExpenseCategory(form);
      router.replace('/categories');
    } catch (error) {
      console.log(error);
    } finally {
      setForm({title: ""});
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        style={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CustomInput
          header={"Название"}
          value={form.title}
          handleChange={(e) => setForm({ ...form, title: e })}
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

export default AddExpenseCategory;
