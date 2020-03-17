const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kiki_saver'
})
const sendLogin = (req, res) => res.sendFile(__dirname + '/public/login.html')
const sendSignup = (req, res) => res.sendFile(__dirname + '/public/signup.html')

const getLoginQuery = (username, password) => {
    return `SELECT id FROM users WHERE username='${username}' AND password='${password}'`  
}

app.get('/', (req, res) => res.send('Hello world!'))
app.get('/login', sendLogin)
app.post('/login', (req, res) => {
    con.query(getLoginQuery(req.body.username, req.body.password), (err, results, fields) => {
            if (err) {
                console.log(err)
            } else if (!results.length) {
                // username and password do not match!
                console.log(results)
                res.send('no results')
            } else {
                console.log(results)
                res.send('hooray you have results')
                // user is logged in
            }
        } )
})
app.get('/signup', sendSignup)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// const auth = con.query(queryString, (err, results, fields) => {
//     if (err) {
//         console.log(err)
//     } else if (!results) {
//         // username and password do not match!
//         res.send('no results')
//     } else {
//         console.log(results)
//         res.send('hooray you have results')
//         // user is logged in
//     }
// })