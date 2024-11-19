import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',          
  user: 'root',              
  password: 'Ana010703',      
  database: 'banco'        
});

export default connection;


export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Ana010703',
      database: 'banco'
    });
    console.log('db connected');
    return connection;
  } catch (e) {
    console.log(e);
    return false;
  }
};
