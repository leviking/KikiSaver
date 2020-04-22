exports.con = require('mysql').createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kiki_saver',
    multipleStatements: true
})