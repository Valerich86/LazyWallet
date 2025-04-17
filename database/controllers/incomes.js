import * as SQLite from 'expo-sqlite';
import { dbName } from '../management';



export async function getTotal (){
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const actualMonth = new Date().toISOString().split('T')[0].substring(0, 7);
    const result = await db.getAllAsync(
      `SELECT currencies.sign, SUM(sum) AS total FROM incomes 
      JOIN wallets ON incomes.wallet_id = wallets.id
      JOIN currencies ON wallets.currency_id = currencies.id
      WHERE date LIKE '${actualMonth}%' GROUP BY wallets.currency_id`
    );
    let i = 0;
    result.forEach(el => {
      el.id = i++;
    });
    return result;
  }catch (error) {
    console.log(error);
  } 
}

export async function addIncome (data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'INSERT INTO incomes (title, wallet_id, sum, category, date, description) VALUES (?, ?, ?, ?, ?, ?)', 
      data.title, data.wallet_id, data.sum, data.category, data.date, data.description
    );
    await db.runAsync(
      `UPDATE wallets SET balance = balance + ${data.sum} WHERE id = ${data.wallet_id}`
    );
    const currentBalance = await db.getFirstAsync(
      `SELECT balance FROM wallets WHERE id = ${data.wallet_id}`
    );
    await db.runAsync(
      'INSERT INTO transactions (wallet_id, date, sum) VALUES (?, ?, ?)', 
      data.wallet_id, data.date, currentBalance.balance
    );
  } catch (error) {
    console.log(error);
  } 
}

export async function getAll () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const result = [];
    const dates = await db.getAllAsync(
      `SELECT date FROM incomes GROUP BY date ORDER BY date DESC`
    );
    for (let i = 0; i < dates.length; i++){
      const data = await db.getAllAsync(`
        SELECT incomes.*, currencies.sign FROM incomes
        LEFT JOIN wallets ON wallets.id = incomes.wallet_id
        LEFT JOIN currencies ON currencies.id = wallets.currency_id
        WHERE date = ?
      `, dates[i].date);
      const total = await db.getAllAsync(
        `SELECT currencies.sign, SUM(sum) AS total FROM incomes 
        JOIN wallets, currencies ON wallets.id = incomes.wallet_id AND currencies.id = wallets.currency_id
        WHERE date = ?
        GROUP BY sign
        `, dates[i].date
      );
      result.push({targetDate: dates[i].date, data: data, totalByCurrency: total});
    }
    return result;
  } catch (error) {
    console.log(error);
  } 
}

export async function getOne (id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const data = await db.getFirstAsync(`
      SELECT incomes.*, currencies.sign FROM incomes 
      LEFT JOIN wallets ON wallets.id=incomes.wallet_id 
      LEFT JOIN currencies ON currencies.id=wallets.currency_id 
      WHERE incomes.id=${id}
    `);
    return data;
  } catch (error) {
    console.log(error);
  } 
}

export async function update (id, data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'UPDATE incomes SET title=?, sum=?, date=?, category=?, wallet_id=?, description=? WHERE id=?;', 
      data.title, data.sum, data.date, data.category, data.wallet_id, data.description, id
    );
  } catch (error) {
    console.log(error);
  } 
}




