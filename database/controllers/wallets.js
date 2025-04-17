import * as SQLite from 'expo-sqlite';
import { dbName } from '../management';

export async function getTotal (){
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const result = await db.getAllAsync(`
      SELECT currencies.sign, SUM(balance) AS sum 
      FROM wallets JOIN currencies 
      ON currencies.id=wallets.currency_id 
      GROUP BY wallets.currency_id
    `)
    let i = 0;
    result.forEach(el => {
      el.id = i++;
    });
    return result;
  }catch (error) {
    console.log(error);
  } 
}

export async function addWallet (data, isTest) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const result = await db.runAsync(
      'INSERT INTO wallets (title, balance, currency_id) VALUES (?, ?, ?)', 
      data.title, data.balance, data.currency_id
    );
    let initDate = new Date().toISOString().split('T')[0];
    if (isTest) initDate = '2025-04-01';
    await db.runAsync(
      'INSERT INTO transactions (wallet_id, date, sum) VALUES (?, ?, ?)', 
      result.lastInsertRowId, initDate, data.balance
    );
  } catch (error) {
    console.log(error);
  } 
}

export async function update (id, data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'UPDATE wallets SET title=?, balance=?, currency_id=? WHERE id=?;', 
      data.title, data.balance, data.currency_id, id
    );
  } catch (error) {
    console.log(error);
  } 
}

export async function getOne (id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const data = await db.getFirstAsync(`
      SELECT wallets.*, currencies.sign
      FROM wallets JOIN currencies 
      ON wallets.currency_id=currencies.id 
      WHERE wallets.id=${id}
    `);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAll (target_id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const data = await db.getAllAsync(`
      SELECT wallets.*, currencies.sign 
      FROM wallets JOIN currencies 
      ON currencies.id=wallets.currency_id
    `);
    if (target_id){
      let targetIndex = 0;
      for (let i = 0; i < data.length; i++){
        if (data[i].id == target_id){
          targetIndex = i;
        }
      }
      data.unshift(data.splice(targetIndex, 1)[0]);
    }
    return data;
  } catch (error) {
    console.log(error);
  } 
}



