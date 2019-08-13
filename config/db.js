const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected');
    con.query('CREATE DATABASE ratings CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', (error) => {
        if (error) throw error;
        console.log('Database created: ratings');
    });
    con.query('CREATE DATABASE ratings_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', (error) => {
        if (error) throw error;
        console.log('Database created: ratings_test');
    });
});
