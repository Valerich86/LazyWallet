import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { getAllExpenseCategories } from "../../database/controllers/expenseCategories";
import { getAllIncomeCategories } from "../../database/controllers/incomeCategories";
import { getAll } from "../../database/controllers/currencies"
import { validate } from "../../services/validateValues";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CustomDropdown from "../../components/CustomDropdown";
import DatePicker from "../../components/DatePicker";
import WrongInputMessage from "../../components/WrongInputMessage";
import { requestReport } from "../../database/controllers/charts";
import Chart from "../../components/Chart";

const Reports = () => {
  const reportTypes = [
    { id: 1, title: "Расходы по категориям", value: "expenses_by_category" },
    { id: 2, title: "Доходы по категориям", value: "incomes_by_category" },
    { id: 3, title: "Круговая диаграмма - расходы", value: "expenses_pie" },
    { id: 3, title: "Круговая диаграмма - доходы", value: "incomes_pie" },
  ];
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  // const [expenseCategoriesVisible, setexpenseCategoriesVisible] = useState(true);
  // const [incomeCategoriesVisible, setincomeCategoriesVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [form, setForm] = useState({
    type: reportTypes[0],
    date_start: new Date().toISOString().split("T")[0],
    date_end: new Date().toISOString().split("T")[0],
    // category: '',
    currency_id: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // let result1 = await getAllIncomeCategories();
      // setIncomeCategories(result1);
      // let result2 = await getAllExpenseCategories();
      // setExpenseCategories(result2);
      let result = await getAll();
      setCurrencies(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (form.date_start > form.date_end) {
      setMessage("Начальная дата не должна превышать конечную");
      return;
    }
    // if (form.category == '' && form.type == 'expenses_by_category') setForm({...form, category: expenseCategories[0].title});
    // if (form.category == '' && form.type == 'incomes_by_category') setForm({...form, category: incomeCategories[0].title});
    
    try {
      const result = await requestReport(form);
      setData(result);
      setReportVisible(true);
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <SafeAreaView>
      <View style={{padding: 15}}>
        <CustomDropdown
          title={"Вид отчёта"}
          selectedValue={{}}
          onValueChange={(e) => {
            // if (e.value === 'expenses_by_category'){
            //   setincomeCategoriesVisible(false);
            //   setexpenseCategoriesVisible(true);
            // }
            // else if (e.value === 'incomes_by_category'){
            //   setexpenseCategoriesVisible(false);
            //   setincomeCategoriesVisible(true);
            // }
            setForm({ ...form, type: e })
          }}
          values={reportTypes}
        />
        {/* {expenseCategoriesVisible && (
          <CustomDropdown
            title={"Категория расходов"}
            selectedValue={{}}
            onValueChange={(e) => setForm({ ...form, category: e.title })}
            values={expenseCategories}
          />
        )}
        {incomeCategoriesVisible && (
          <CustomDropdown
            title={"Категория доходов"}
            selectedValue={{}}
            onValueChange={(e) => setForm({ ...form, category: e.title })}
            values={incomeCategories}
          />
        )} */}
        <DatePicker
          header={"Начало периода"}
          onDaySelect={(d) =>
            setForm({
              ...form,
              date_start: d,
            })
          }
          selectedValue={new Date(form.date_start)
            .toLocaleString()
            .substring(0, 10)}
        />
        <DatePicker
          header={"Конец периода"}
          onDaySelect={(d) =>
            setForm({
              ...form,
              date_end: d,
            })
          }
          selectedValue={new Date(form.date_end)
            .toLocaleString()
            .substring(0, 10)}
        />
        <CustomDropdown
          title={"Валюта"}
          selectedValue={{}}
          onValueChange={(e) => setForm({ ...form, currency_id: e.id })}
          values={currencies}
        />
        
        {message && <WrongInputMessage message={message} />}
        <View style={{ marginTop: 25 }}></View>
        <CustomButton
          text={"Сформировать отчет"}
          width={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={handleSubmit}
        />
      </View>
      {reportVisible && (
        <Chart
          reportVisible = {reportVisible}
          setReportVisible = {setReportVisible}
          dataForChart = {data}
          dataForHeader = {form}
        />
      )}
    </SafeAreaView>
  );
};

export default Reports;

