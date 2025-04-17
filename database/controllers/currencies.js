import * as SQLite from 'expo-sqlite';
import { dbName } from '../management';

export async function addCurrency (data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'INSERT INTO currencies (title, code, sign) VALUES (?, ?, ?)', 
      data.title, data.code, data.sign
    );
  } catch (error) {
    console.log(error);
  } 
}

export async function getAll (target_id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const data = await db.getAllAsync(`
      SELECT * FROM currencies
    `);
    let targetIndex = 0;
    for (let i = 0; i < data.length; i++){
      if (data[i].id == target_id){
        targetIndex = i;
      }
    }
    data.unshift(data.splice(targetIndex, 1)[0]);
    return data;
  } catch (error) {
    console.log(error);
  } 
}