import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportFile = async (data, total) => {
  const uri = FileSystem.documentDirectory + "LazyWalletReport.txt";

  let dataText = `Всего за текущий месяц: `;
  total.forEach((element) => {
    dataText += `${element.total} \n`;
  });
  data.forEach((element) => {
    dataText += `\n\n${new Date(element.targetDate)
      .toLocaleString()
      .substring(0, 10)}\n\n`;
    let oneDateTransactions = element.data;
    oneDateTransactions.forEach((item) => {
      dataText += `Категория: ${item.category}
      ${item.title} - ${item.sum}
      Описание: ${item.description}
      id кошелька: ${item.wallet_id}\n`;
    });
    dataText += `Итого за день:\t\t`;
    let oneDateTotal = element.totalByCurrency;
    oneDateTotal.forEach((item) => {
      dataText += `${item.total} \n`;
    });
  });

  try {
    await FileSystem.writeAsStringAsync(uri, dataText, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    await FileSystem.deleteAsync(uri);
    console.log("Файл удалён успешно");
  } catch (error) {
    console.log(error);
  }
};
