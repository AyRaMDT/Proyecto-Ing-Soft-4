import mysql from 'mysql2/promise';
import 'dotenv/config';

import dotenv from 'dotenv';
dotenv.config({ path: '/env' });
dotenv.config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME
};

export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('db connected');
    return connection;
  } catch (e) {
    console.log(e);
    return false;
  }
};
