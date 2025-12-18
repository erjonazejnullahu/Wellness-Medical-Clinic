const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'meduser',
  password: 'medpass123',
  database: 'clinic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ Database configuration loaded');
console.log('- User: meduser');
console.log('- Database: clinic');

module.exports = pool.promise();