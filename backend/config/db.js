import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});


//connect to database
db.connect(err =>{
    if(err){
        console.log('Database connection error: ', err);
        return;
    }
    console.log('Database connected successfully');
})

export default db;