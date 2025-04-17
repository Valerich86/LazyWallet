import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '../../constants/colors';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{drawerPosition: 'right'}}>
      <Drawer.Screen
          name="profile" 
          options={{
            drawerLabel: 'Кабинет',
            title: 'Кабинет',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.yellow}]}>
                  <FontAwesome5 name="user-secret" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="wallets" 
          options={{
            drawerLabel: 'Кошельки',
            title: 'Кошельки',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.orange}]}>
                  <MaterialCommunityIcons name="wallet" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="incomes" 
          options={{
            drawerLabel: 'Доходы',
            title: 'Доходы',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.green}]}>
                  <MaterialCommunityIcons name="cash-plus" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="expenses" 
          options={{
            drawerLabel: 'Расходы',
            title: 'Расходы',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.red}]}>
                  <MaterialCommunityIcons name="cash-minus" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="budgets" 
          options={{
            drawerLabel: 'Бюджеты',
            title: 'Бюджеты',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.blue}]}>
                  <FontAwesome6 name="pen-ruler" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="reports" 
          options={{
            drawerLabel: 'Отчёты',
            title: 'Отчёты',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.yellow}]}>
                  <MaterialCommunityIcons name="calculator" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="categories" 
          options={{
            drawerLabel: 'Категории',
            title: 'Категории',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: Colors.orange}]}>
                  <MaterialIcons name="category" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Drawer.Screen
          name="development" 
          options={{
            drawerLabel: 'Средства разработчика',
            title: 'Средства разрабочика',
            drawerIcon: ({ focused }) => {
              return (
                <View style={[styles.icon, {backgroundColor: 'red'}]}>
                  <MaterialIcons name="dangerous" size={24} color="black" />
                </View>
              );
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2
  }
})