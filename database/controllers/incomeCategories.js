import * as SQLite from 'expo-sqlite';
import { dbName } from '../management';

export async function addIncomeCategory (data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'INSERT INTO incomeCategories (title) VALUES (?)', 
      data.title
    );
  } catch (error) {
    console.log(error);
  } 
}

export async function getAllIncomeCategories (target_title = '') {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    const data = await db.getAllAsync(`
      SELECT * FROM incomeCategories ORDER BY title ASC
    `);
    let targetIndex = 0;
    for (let i = 0; i < data.length; i++){
      if (data[i].title == target_title){
        targetIndex = i;
      }
    }
    data.unshift(data.splice(targetIndex, 1)[0]);
    return data;
  } catch (error) {
    console.log(error);
  } 
}