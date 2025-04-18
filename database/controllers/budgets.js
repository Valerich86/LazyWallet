import * as SQLite from "expo-sqlite";
import { dbName } from "../management";

export async function add(data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    let result = await db.runAsync(
      `INSERT INTO budgets 
      (title, date_start, date_end, category, 
      currency_id, sum, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      data.title,
      data.date_start,
      data.date_end,
      data.category,
      data.currency_id,
      data.sum,
      data.description
    );
    const id = result.lastInsertRowId;

    if (data.category == "Все") {
      result = await db.getAllAsync(
        `SELECT SUM(sum) AS total_spent FROM expenses 
        LEFT JOIN wallets ON wallets.id = expenses.wallet_id
        LEFT JOIN currencies ON currencies.id = wallets.currency_id
        WHERE date <= '${data.date_end}' AND date >= '${data.date_start}'
        AND currency_id = ${data.currency_id}`
      );
    } else {
      result = await db.getAllAsync(
        `SELECT SUM(sum) AS total_spent FROM expenses 
        LEFT JOIN wallets ON wallets.id = expenses.wallet_id
        LEFT JOIN currencies ON currencies.id = wallets.currency_id
        WHERE date <= '${data.date_end}' AND date >= '${data.date_start}'
        AND category = '${data.category}'
        AND currency_id = ${data.currency_id}`
      );
    }
    if (result) {
      await db.runAsync(
        `UPDATE budgets SET spent = ${result[0].total_spent} WHERE id = ${id}`
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAllBudgets() {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    const result = await db.getAllAsync(`
      SELECT budgets.*, currencies.sign FROM budgets
      JOIN currencies ON currencies.id=budgets.currency_id
      ORDER BY budgets.id DESC
    `);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getOne(id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    const data = await db.getFirstAsync(`
      SELECT budgets.*, currencies.sign FROM budgets 
      JOIN currencies ON currencies.id=budgets.currency_id
      WHERE budgets.id=${id}
    `);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function update(id, data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try {
    await db.runAsync(
      `UPDATE budgets SET
      title=?, date_start=?, date_end=?, category=?, 
      currency_id=?, sum=?, description=?`,
      data.title,
      data.date_start,
      data.date_end,
      data.category,
      data.currency_id,
      data.sum,
      data.description
    );
    if (data.category == "Все") {
      result = await db.getAllAsync(
        `SELECT SUM(sum) AS total_spent FROM expenses 
        WHERE date <= '${data.date_end}' AND date >= '${data.date_start}'`
      );
    } else {
      result = await db.getAllAsync(
        `SELECT SUM(sum) AS total_spent FROM expenses 
        WHERE date <= '${data.date_end}' AND date >= '${data.date_start}'
        AND category = '${data.category}'`
      );
    }
    if (result) {
      await db.runAsync(
        `UPDATE budgets SET spent = ${result[0].total_spent} WHERE id = ${id}`
      );
    }
  } catch (error) {
    console.log(error);
  }
}
