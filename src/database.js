import mysql from 'mysql2/promise';
import 'dotenv/config';
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE
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
