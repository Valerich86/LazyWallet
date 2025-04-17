import React, { useState } from "react";
import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import EvilIcons from '@expo/vector-icons/EvilIcons';

LocaleConfig.locales["ru"] = {
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  today: "Сегодня",
};

LocaleConfig.defaultLocale = "ru";

export default function DatePicker({ header, onDaySelect, selectedValue }) {
  const initDate = new Date().toString();
  const [selected, setSelected] = useState(initDate);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const getMarked = () => {
    let marked = {};
    marked[selected] = {
      selected: true,
      selectedColor: "#222222",
      selectedTextColor: "yellow",
    };
    return marked;
  };

  return (
    <>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputHeader}>{header}</Text>
        <TouchableOpacity onPress={() => setCalendarVisible(true)} style={styles.inputView}>
          <Text style={{ fontSize: 18 }}>{selectedValue}</Text>
          <EvilIcons name="calendar" size={40} color="gray" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarVisible}
        onRequestClose={() => {
          setCalendarVisible(!calendarVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Calendar
              style={{
                borderRadius: 5,
                elevation: 5,
              }}
              initialDate={initDate}
              markedDates={getMarked()}
              onDayPress={(day) => {
                setSelected(day.dateString);
                onDaySelect(day.dateString);
                setCalendarVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#1c1d1d",
    borderRadius: 20,
    borderWidth: 3,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    width: "80%",
  },
  inputHeader: {
    fontSize: 17,
    fontStyle: "italic",
  },
  inputView: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 5,
    borderColor: "gray",
    backgroundColor: "white",
    opacity: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10
  },
});
