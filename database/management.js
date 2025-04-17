import * as SQLite from 'expo-sqlite';
import * as FS from 'expo-file-system';
import { CurrencyType, IncomeType, ExpenseType } from '../constants/collections';

export const dbName = 'LazyWallet.db';

export async function createTablesIfNotExists () {
  try{
    await createCurrenciesTable();
    await createIncomeCategoriesTable();
    await createExpenseCategoriesTable();
    createWalletsTable();
    createIncomesTable();
    createExpensesTable();
    createBudgetsTable();
    createTransactionsTable();
  } catch (error) {
    console.log(error);
  } 
}

async function addCurrency (data) {
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

async function addExpenseCategory (data) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(
      'INSERT INTO expenseCategories (title) VALUES (?)', 
      data.title
    );
  } catch (error) {
    console.log(error);
  } 
}

async function addIncomeCategory (data) {
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

export async function createTransactionsTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'wallet_id' INTEGER, 
      'date' TEXT,
      'sum' REAL,
      FOREIGN KEY (wallet_id)  REFERENCES wallets (id)
      );
    `);
    console.log("Таблица балансы добавлена");
  } catch (error) {
    console.log(error);
  } 
}

export async function createCurrenciesTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS currencies (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT, 
      'code' TEXT,
      'sign' TEXT
      );
    `);
    for (let i = 0; i < CurrencyType.length; i++){
      await addCurrency(CurrencyType[i]);
    }
    console.log("Таблица валюты добавлена");
  } catch (error) {
    console.log(error);
  } 
}

export async function createIncomeCategoriesTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incomeCategories (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT
      );
    `);
    for (let i = 0; i < IncomeType.length; i++){
      await addIncomeCategory(IncomeType[i]);
    }
    console.log("Таблица категории доходов добавлена");
  } catch (error) {
    console.log(error);
  } 
}

export async function createExpenseCategoriesTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenseCategories (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT
      );
    `);
    for (let i = 0; i < ExpenseType.length; i++){
      await addExpenseCategory(ExpenseType[i]);
    }
    console.log("Таблица категории расходов добавлена");
  } catch (error) {
    console.log(error);
  } 
}

export async function createWalletsTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS wallets (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT, 
      'balance' REAL,
      'currency_id' INTEGER,
      FOREIGN KEY (currency_id)  REFERENCES currencies (id) 
      );
      `);
    console.log("Таблица кошельки добавлена");
  } catch (error) {
    console.log(error);
  }
}

export async function createBudgetsTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT, 
      'date_start' TEXT,
      'date_end' TEXT,
      'category' TEXT,
      'currency_id' INTEGER,
      'sum' REAL,
      'spent' REAL DEFAULT 0,
      'description' TEXT,
      FOREIGN KEY (currency_id) REFERENCES currencies (id) 
      );
    `);
    console.log("Таблица бюджеты по категории добавлена");
  } catch (error) {
    console.log(error);
  }
}

export async function createIncomesTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incomes (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT, 
      'wallet_id' INTEGER,
      'sum' REAL,
      'category' TEXT,
      'date' TEXT,
      'description' TEXT,
      FOREIGN KEY (wallet_id)  REFERENCES wallets (id) ON DELETE CASCADE
      );
      `);
    console.log("Таблица доходы добавлена");
  } catch (error) {
    console.log(error);
  }
}

export async function createExpensesTable () {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
      'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
      'title' TEXT, 
      'wallet_id' INTEGER,
      'sum' REAL,
      'category' TEXT,
      'date' TEXT,
      'description' TEXT,
      FOREIGN KEY (wallet_id)  REFERENCES wallets (id) ON DELETE CASCADE
      );
      `);
    console.log("Таблица расходы добавлена");
  } catch (error) {
    console.log(error);
  }
}

export const checkExistenceDb = async () => {
  const dbDir = FS.documentDirectory + 'SQLite/';
  const dirInfo = await FS.getInfoAsync(dbDir + dbName);
  
  if (!dirInfo.exists){
    console.log("База данных добавлена");
    await createTablesIfNotExists(dbName);
  }
  else console.log ('База данных существует и не пуста');
}

export async function deleteDb () {
  const db = await SQLite.openDatabaseAsync(dbName);
  await db.closeAsync();
  try{
    await SQLite.deleteDatabaseAsync(dbName);
    console.log('База данных удалена')
    await createTablesIfNotExists();
  } catch (error) {
    console.log(error);
  }
}

export async function removeOneItemFrom (table, id) {
  const db = await SQLite.openDatabaseAsync(dbName);
  try{
    await db.runAsync(`DELETE FROM ${table} WHERE id=${id}`);
    if (table == 'wallets'){
      await db.runAsync(`DELETE FROM transactions WHERE wallet_id=${id}`);
      await db.runAsync(`DELETE FROM expenses WHERE wallet_id=${id}`);
      await db.runAsync(`DELETE FROM incomes WHERE wallet_id=${id}`);
    }
    return true;
  } catch (error) {
    console.log(error);
  } finally {
    await db.closeAsync();
  }
}


