const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
app.use(express.static('public'))
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
const sendAdmin = (req, res) => res.sendFile(__dirname + '/public/admin.html')

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

//Login stuff
const sendLogin = (req, res) => res.sendFile(__dirname + '/public/login.html')
const getLoginQuery = (username, password) => {
    return `SELECT id FROM users WHERE username='${username}' AND password='${password}'`  
}
const getAttendanceQuery = (id, ip) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), 0, '${ip}')`
}
const logAttendance = (id, ip) => con.query(getAttendanceQuery(id, ip), (err, results, fields) => {
    if (err) {
        console.log(err)
    } else {
        res.send('You\'re attendance has been logged!')
    }
})

const login = (req, res) => {
    con.query(getLoginQuery(req.body.username, req.body.password), (err, results, fields) => {
            if (err) {
                console.log(err)
            } else if (!results.length) {
                // username and password do not match!
                console.log(results)
                res.send('no results')
            } else {
                logAttendance(results[0].id, req.ip)
                // user is logged in
            }
        })
    }

app.get('/login', sendLogin)
app.post('/login', login)

//Sign up stuff
const sendSignup = (req, res) => res.sendFile(__dirname + '/public/signup.html')
const getSignupQuery = (username, password) => `insert into users(username, password, created_at) values ('${username}', '${password}', now())`
const createUser = (req, res) => {
    con.query(getSignupQuery(req.body.username, req.body.password), function(error, results, fields) {
        if (error) {
            res.status(400).send(`${JSON.stringify(error)}.`);
            return;
        };
        if (results) res.redirect('/');
    })
}

app.get('/signup', sendSignup)
app.post('/signup', createUser)

//Admin stuff
app.get('/admin', sendAdmin)

app.get('*',(req,res)=>res.status(404).sendFile(__dirname + '/public/404.html'))
//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))