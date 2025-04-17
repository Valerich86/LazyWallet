import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { getAll } from "../../../database/controllers/currencies";
import { addWallet } from "../../../database/controllers/wallets";
import { validate } from "../../../services/validateValues";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomDropdown from "../../../components/CustomDropdown";
import WrongInputMessage from "../../../components/WrongInputMessage";

const Create = () => {
  const [currencies, setCurrencies] = useState([]);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    balance: 0,
    currency_id: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getAll();
      setCurrencies(result);
    } catch (error) {
      console.log(error);
    } 
  };

  const handleSubmit = async () => {
    let response = validate([
      { value: form.title.trim(), field: "Название" },
      { value: form.balance.toString().trim(), field: "Баланс" },
    ]);
    if (!response.isValid) {
      setMessage(response.message);
      return;
    }
    
    try {
      await addWallet(form);
      router.replace("/wallets");
    } catch (error) {
      console.log(error);
    } finally {
      setForm({
        title: "",
        balance: 0,
        currency_id: 1
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 15 }}>
        <CustomInput
          header={"Название"}
          value={form.title}
          handleChange={(e) => setForm({ ...form, title: e })}
        />
        <CustomInput
          header={"Баланс"}
          value={form.balance}
          handleChange={(e) => setForm({ ...form, balance: e })}
          type={"decimal-pad"}
        />
        <CustomDropdown
          title={"Валюта"}
          selectedValue={currencies[0]?.title}
          onValueChange={(e) => setForm({ ...form, currency_id: e.id })}
          values={currencies}
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
      </View>
    </SafeAreaView>
  );
};

export default Create;
