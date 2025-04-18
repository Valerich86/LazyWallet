import {
  View,
  StyleSheet,
  Animated,
  useAnimatedValue,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as MediaLibrary from 'expo-media-library';
import {checkExistenceDb} from "../database/management.js";
import { getAll } from "@/database/controllers/wallets.js";
import { getAllBudgets } from "@/database/controllers/budgets.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function walletNegativeValuePush() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Баланс кошелька отрицательный.",
      body: "Проверьте и внесите изменения.",
    },
    trigger: null,
  });
}

async function exceedingBudgetPush() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Обнаружено превышение бюджета.",
      body: "Проверьте и внесите изменения.",
    },
    trigger: null,
  });
}

const App = () => {
  const zooming = useAnimatedValue(0);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const checkPermissions = async () => {
    console.log(permissionResponse.status)
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
  }

  const checkDb = async () => {
    setIsLoading(true);
    try {
      await checkExistenceDb();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkNotifications = async () => {
    try {
      let budgets = await getAllBudgets();
      if (budgets.length > 0) {
        budgets.forEach((element) => {
          if (element.sum - element.spent < 0) exceedingBudgetPush();
        });
      }
      let wallets = await getAll();
      if (wallets.length == 0 || wallets == undefined) {
        Alert.alert("Прежде всего нужно добавить кошелёк (счёт)");
        router.replace("views/wallet/create");
      } else {
        wallets.forEach((element) => {
          if (element.balance < 0) walletNegativeValuePush();
        });
        router.push("/(drawer)/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Animated.timing(zooming, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    checkPermissions();
    checkDb();
    setTimeout(checkNotifications, 3000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ transform: [{ scale: zooming }] }}>
        <View style={{ width: "100%", height: 200 }}>
          <Image
            source={require("../assets/images/logo.png")}
            style={{ height: 130 }}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
