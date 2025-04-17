import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// export const saveFile = async () => {
//   let data = ["Ram", "Shyam",
//     "Sita", "Gita"];
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Расходы</title>
//         <style>
//             h1 {
//                 text-align: center;
//             }
//         </style>
//     </head>
//     <body>
//         <h1>Расходы за период </h1>
//         <ul>${data.map(item =>
//             <li>${item}</li>)}
//         </ul>
//     </body>
//     </html>
// `;

//   try {
//     const { uri } = await Print.printToFileAsync({ html: htmlContent });
//     console.log("File has been saved to:", uri);
//     await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
//     await FileSystem.deleteAsync(uri);
//     console.log("Файл удалён успешно");
//   } catch (err) {
//     console.error(err);
//   }
// };

export const exportFile = async (data, total) => {

  const uri = FileSystem.documentDirectory + 'LazyWalletReport.txt';

  let dataText = `Всего за текущий месяц: `;
  total.forEach(element => {
    dataText += `${element.total} \n`
  });
  data.forEach(element => {
    console.log(element)
    dataText += `\n\n${new Date(element.targetDate).toLocaleString().substring(0, 10)}\n\n`;
    let oneDateTransactions = element.data;
    oneDateTransactions.forEach(item => {
      dataText += `Категория: ${item.category}
      ${item.title} - ${item.sum}
      Описание: ${item.description}
      id кошелька: ${item.wallet_id}\n`
    });
    dataText += `Итого за день:\t\t`;
    let oneDateTotal = element.totalByCurrency;
    oneDateTotal.forEach(item => {
      dataText += `${item.total} \n`
    });
  });

  try {
    await FileSystem.writeAsStringAsync(uri, dataText, {encoding: FileSystem.EncodingType.UTF8});
    console.log(dataText);
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    await FileSystem.deleteAsync(uri);
    console.log("Файл удалён успешно");
  } catch (error) {
    console.log(error);
  }
}
