const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
app.use(express.json());
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kiki_saver'
})

const logIn = () => {
    const queryString = `SELECT user_id FROM users WHERE username=${username} AND password=${password}`
    con.query(queryString), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else if (!results) {
            // username and password do not match!
        } else {
            // user is logged in
        }
    }
}

app.get('/', (req, res) => res.send('Hello world!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))