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

const logAttendance = (id, ip) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), 0, '${ip}')`
}

app.get('/', (req, res) => res.send('Hello world!'))

//Login stuff
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
                con.query(logAttendance(results[0].id, req.ip), (err, results, fields) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send('You\'re attendance has been logged!')
                    }
                })
                // user is logged in
            }
        } )
})

//Sign up stuff
app.get('/signup', sendSignup)
app.post('/signup', (req, res) => {
    con.query(`insert into users(username, password, created_at) values ('${req.body.username}', '${req.body.password}', now())`, function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`);
            return;
        };
        if (results) res.redirect('/');
    })
})


//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))