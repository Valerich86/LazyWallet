import {View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getAll } from "../../../../database/controllers/currencies";
import { validate } from "../../../../services/validateValues";
import {getOne, update} from "../../../../database/controllers/wallets";
import CustomButton from "../../../../components/CustomButton";
import CustomInput from "../../../../components/CustomInput";
import CustomDropdown from "../../../../components/CustomDropdown";

const Update = () => {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result = await getOne(id);
      setForm({
        title: result.title,
        balance: result.balance.toString(),
        currency_id: result.currency_id,
      });
      result = await getAll(result.currency_id);
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
      await update(id, form);
      router.replace(`/views/wallet/info/${id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setForm({});
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
          type={"numeric"}
        />
        <CustomDropdown
          title={"Валюта"}
          selectedValue={{}}
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

export default Update;
