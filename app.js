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
const sendLogin = (req, res) => res.sendFile(__dirname + '/public/login.html')
const sendSignup = (req, res) => res.sendFile(__dirname + '/public/signup.html')

const getLoginQuery = (username, password) => {
    return `SELECT user_id FROM users WHERE username=${username} AND password=${password}`  
}

app.get('/', (req, res) => res.send('Hello world!'))
app.get('/login', sendLogin)
app.get('/signup', sendSignup)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// con.query(queryString), (err, results, fields) => {
//     if (err) {
//         console.log(err)
//     } else if (!results) {
//         // username and password do not match!
//     } else {
//         // user is logged in
//     }
// }