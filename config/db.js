const mysql = require('mysql');
require('dotenv').config('/.env');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected');
    con.query(`CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, (error) => {
        if (error) throw error;
        console.log(`Database created: ${process.env.DB_NAME}`);
    });
    con.query(`CREATE DATABASE ${process.env.DB_TEST_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, (error) => {
        if (error) throw error;
        console.log(`Test database created: ${process.env.DB_TEST_NAME}`);
    });
});
