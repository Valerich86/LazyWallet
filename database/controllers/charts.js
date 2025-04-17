import * as SQLite from "expo-sqlite";
import { dbName } from "../management";

function generateColor() {
  let color = "#";
  let digits = "0123456789ABCDEF";
  for (let i = 0; i < 6; i++) {
    // Генерируем случайное число между 0 и 15
    let randomDigit = Math.floor(Math.random() * 16);
    // Добавляем случайное число в строку цвета
    color += digits[randomDigit];
  }
  return color;
}

export async function getDataForWalletChart(wallet_id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    const points = await db.getAllAsync(`
      SELECT MAX(id) AS lastId, date FROM transactions 
      WHERE wallet_id=${wallet_id}
      GROUP BY date
      ORDER BY DATE(date) ASC
    `);
    let result = [];
    for (let i = 0; i < points.length; i++) {
      const balance = await db.getFirstAsync(`
        SELECT sum FROM transactions 
        WHERE id=${points[i].lastId}
      `);
      result.push({
        label: new Date(points[i].date).toLocaleString().substring(0, 5),
        value: balance.sum,
      });
    }

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function requestReport(data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    let result = [];
    let total = 0;
    switch (data.type.value) {
      case "expenses_by_category":
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS value, currencies.sign, category AS label FROM expenses
          LEFT JOIN wallets ON wallets.id = expenses.wallet_id
          LEFT JOIN currencies ON currencies.id = wallets.currency_id
          WHERE currency_id = ${data.currency_id}
          AND date <= '${data.date_end}' AND date >= '${data.date_start}'
          GROUP BY label ORDER BY value DESC`
        );
        for (let i = 0; i < result.length; i++) {
          result[i].frontColor = generateColor();
        }
        break;
      case "incomes_by_category":
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS value, currencies.sign, category AS label FROM incomes
          LEFT JOIN wallets ON wallets.id = incomes.wallet_id
          LEFT JOIN currencies ON currencies.id = wallets.currency_id
          WHERE currency_id = ${data.currency_id}
          AND date <= '${data.date_end}' AND date >= '${data.date_start}'
          GROUP BY label ORDER BY value DESC`
        );
        for (let i = 0; i < result.length; i++) {
          result[i].frontColor = generateColor();
        }
        break;
      case "expenses_pie":
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS total FROM expenses
          LEFT JOIN wallets ON wallets.id = expenses.wallet_id
          LEFT JOIN currencies ON currencies.id = wallets.currency_id
          WHERE currency_id = ${data.currency_id}
          AND date <= '${data.date_end}' AND date >= '${data.date_start}'`
        );
        total = result[0].total;
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS value, currencies.sign, category AS label FROM expenses
          LEFT JOIN wallets ON wallets.id = expenses.wallet_id
          LEFT JOIN currencies ON currencies.id = wallets.currency_id
          WHERE currency_id = ${data.currency_id}
          AND date <= '${data.date_end}' AND date >= '${data.date_start}'
          GROUP BY label ORDER BY value DESC`
        );
        for (let i = 0; i < result.length; i++) {
          result[i].text =
            Math.round((result[i].value / total) * 100).toString() + "%";
          result[i].color = generateColor();
        }
        break;
      case "incomes_pie":
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS total FROM incomes
            LEFT JOIN wallets ON wallets.id = incomes.wallet_id
            LEFT JOIN currencies ON currencies.id = wallets.currency_id
            WHERE currency_id = ${data.currency_id}
            AND date <= '${data.date_end}' AND date >= '${data.date_start}'`
        );
        total = result[0].total;
        result = await db.getAllAsync(
          `SELECT SUM(sum) AS value, currencies.sign, category AS label FROM incomes
            LEFT JOIN wallets ON wallets.id = incomes.wallet_id
            LEFT JOIN currencies ON currencies.id = wallets.currency_id
            WHERE currency_id = ${data.currency_id}
            AND date <= '${data.date_end}' AND date >= '${data.date_start}'
            GROUP BY label ORDER BY value DESC`
        );
        for (let i = 0; i < result.length; i++) {
          result[i].text =
            Math.round((result[i].value / total) * 100).toString() + "%";
          result[i].color = generateColor();
        }
        break;
    }
    if (!result) return [];
    return result;
  } catch (error) {
    console.log(error);
  }
}
