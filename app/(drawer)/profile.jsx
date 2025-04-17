import { StyleSheet, Text, View, Alert, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { Marquee } from "@animatereactnative/marquee";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {saveFile} from '../../services/FileSystem';

const Profile = () => {
  const [exchangeRate, setExchangeRate] = useState([]);
  const today = new Date().toLocaleString().substring(0, 10);

  const getExchangeRates = async () => {
    let result = [];
    fetch("https://www.cbr-xml-daily.ru/daily_json.js")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((res) => {
        let diff = res.Valute.EUR.Value - res.Valute.EUR.Previous;
        diff = diff.toFixed(3);
        if (diff > 0) diff = `+ ${diff}`;
        res.Valute.EUR.Diff = diff;
        result.push(res.Valute.EUR);
        diff = res.Valute.USD.Value - res.Valute.USD.Previous;
        diff = diff.toFixed(3);
        if (diff > 0) diff = `+ ${diff}`;
        res.Valute.USD.Diff = diff;
        result.push(res.Valute.USD);
        diff = res.Valute.CNY.Value - res.Valute.CNY.Previous;
        diff = diff.toFixed(3);
        if (diff > 0) diff = `+ ${diff}`;
        res.Valute.CNY.Diff = diff;
        result.push(res.Valute.CNY);
        diff = res.Valute.UAH.Value - res.Valute.UAH.Previous;
        diff = diff.toFixed(3);
        if (diff > 0) diff = `+ ${diff}`;
        res.Valute.UAH.Diff = diff;
        result.push(res.Valute.UAH);
        setExchangeRate(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getExchangeRates();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
          <Text style={{color: 'red'}}>Меню навигации здесь</Text>
          <View style={{transform: [{rotateZ: '-45deg'}], position: 'absolute', left: '75%', top: -30}}>
          <FontAwesome name="long-arrow-right" size={50} color="red" />
          </View>
        </View>
        <View style={{ width: "100%", height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Text style={{fontSize: 20, fontStyle: 'italic', color: '#187a5c'}}>Добро пожаловать в</Text>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ height: 100 }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Button
            title="Создать файл"
            onPress={saveFile}
          />
        </View>
        <View>
          <Marquee speed={0.5}>
            <View style={{ flexDirection: "row" }}>
              {exchangeRate.map((item) => (
                <View
                  key={item.ID}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: 50,
                  }}
                >
                  <Text style={{ fontStyle: "italic" }}>
                    {item.Name} ({item.CharCode}) -{" "}
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: "500" }}>
                    {item.Value}₽ ({item.Diff})
                  </Text>
                </View>
              ))}
            </View>
          </Marquee>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  content: {
    height: "100%",
    padding: 15,
    justifyContent: 'space-between'
  },
  header: {
    backgroundColor: "yellow",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
});
