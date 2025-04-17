import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BarChart, PieChart } from "react-native-gifted-charts";
import ListEmpty from "./ListEmpty";

const Chart = ({
  reportVisible,
  setReportVisible,
  dataForChart,
  dataForHeader,
}) => {
  const [selectedItem, setSelectedItem] = useState(dataForChart[0]);
  const dateStart = new Date(dataForHeader.date_start)
    .toLocaleString()
    .substring(0, 10);
  const dateEnd = new Date(dataForHeader.date_end)
    .toLocaleString()
    .substring(0, 10);

  return (
    <Modal
      animationType="slide"
      visible={reportVisible}
      onRequestClose={() => {
        setReportVisible(!reportVisible);
      }}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
          onPress={() => setReportVisible(false)}
          style={{ opacity: 0.8 }}
        >
          <Ionicons name="chevron-back-circle-sharp" size={50} color="gray" />
        </TouchableOpacity>
        {dataForChart.length == 0 && <ListEmpty />}
        {dataForChart.length > 0 && (
          <>
            <View>
              <Text
                style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}
              >
                {dataForHeader.type.title} ({dataForChart[0]?.sign}) за период
              </Text>
              <Text style={{ fontStyle: "italic", textAlign: "center" }}>
                {dateStart} - {dateEnd}
              </Text>
              {(dataForHeader.type.value == "expenses_by_category" ||
                dataForHeader.type.value == "incomes_by_category") && (
                <View>
                  <View style={{ marginBottom: 100 }}>
                    <BarChart
                      data={dataForChart}
                      onPress={(item, index) => setSelectedItem(item)}
                      height={400}
                      yAxisThickness={0}
                      isThreeD
                      barWidth={40}
                      sideWidth={15}
                      side="right"
                      yAxisLabelWidth={40}
                      rotateLabel
                      showValuesAsTopLabel
                      isAnimated
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{selectedItem.label} - </Text>
                    <Text style={{ fontWeight: "500" }}>
                      {selectedItem.value} {selectedItem.sign}
                    </Text>
                  </View>
                </View>
              )}
              {(dataForHeader.type.value == "expenses_pie" ||
                dataForHeader.type.value == "incomes_pie") && (
                <View style={{alignItems: 'center'}}>
                  <View style={{ marginBottom: 30, marginTop: 15 }}>
                    <PieChart
                      data={dataForChart}
                      showText
                      showTextBackground
                      textColor="black"
                      textBackgroundRadius={15}
                      radius={150}
                      textSize={10}
                    />
                  </View>
                  <View style={{width: '100%', height: 214, borderRadius: 10, borderWidth: 2, borderColor: 'gray', paddingLeft: 10}}>
                    <FlatList
                      data={dataForChart}
                      keyExtractor={(item) => item.label}
                      renderItem={({item}) => (
                        <View style={{flexDirection: 'row', alignItems: 'center'}} key={item.label}>
                          <View style={{backgroundColor: item.color, borderRadius: 5, width: 35, height: 35, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white'}}>{item.text}</Text>
                          </View>
                          <Text style={{marginLeft: 15}}>{item.label}</Text>
                        </View>
                      )}
                    />
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default Chart;

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 50,
  },
});
