import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-gifted-charts";
import { removeOneItemFrom } from "../../../../database/management.js";
import { getOne } from "../../../../database/controllers/wallets.js";
import { getDataForWalletChart } from "../../../../database/controllers/charts.js";
import CustomButton from "../../../../components/CustomButton.jsx";
import { Colors } from "../../../../constants/colors.js";

const Info = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [dataForChart, setDataForChart] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let result1 = await getOne(id);
      let result2 = await getDataForWalletChart(id);
      setData(result1);
      setDataForChart(result2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      let result = await removeOneItemFrom("wallets", id);
      if (result) {
        Alert.alert("Кошелек удалён!");
        router.replace("/wallets");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text
          style={{ fontSize: 20, fontWeight: "700" }}
          width='50%'
        >
          {data.title}
        </Text>
        <Text
          style={{ fontSize: 20, fontWeight: "700" }}
        >
          {data.balance}
          {data.sign}
        </Text>
      </View>
      <View style={styles.content}>
        {dataForChart.length > 0 && (
          <LineChart 
            showValuesAsDataPointsText={true}
            yAxisLabelWidth={40}
            yAxisThickness={0}
            height={400}
            data = {dataForChart} 
            dataPointsColor='green'
            color1="green" 
            isAnimated = {true}
          />
        )}
      </View>
      <View style={styles.footer}>
        <CustomButton
          text={"Редактировать"}
          width={"100%"}
          height={48}
          bgColor={"green"}
          handlePress={() => router.push(`/views/wallet/update/${id}`)}
        />
        <View style={{ marginTop: 15 }}>
          <CustomButton
            text={"Удалить"}
            width={"100%"}
            height={48}
            bgColor={"red"}
            handlePress={handleDelete}
          />
          <Text style={{ fontStyle: "italic", color: "red", textAlign: 'center' }}>
            Обратите внимание, что при удалении кошелька также будут удалены все
            связанные с ним операции!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.header,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
  },
  content: {
    height: "55%",
    padding: 15
  },
  footer: {
    justifyContent: "center",
    height: "35%",
    paddingLeft: 15,
    paddingRight: 15,
  },
});
