const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kiki_saver'
})

// Splash stuff
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/src/css/style.css', (req, res) => { res.sendFile(__dirname + '/src/css/style.css') })


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
        return true;
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
            if (logAttendance(results[0].id, req.ip)) res.sendFile(__dirname + '/public/success.html')
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
const sendAdmin = (req, res) => {

    if (isAdmin()) {
        res.sendFile(__dirname + '/public/admin.html')
    } else {
        res.redirect('/')
    }
}

const isAdmin = (user_id) => {
    con.query(`select id from users where is_admin and id=${user_id}`), (error, results, fields) => {
        if (error || !results.length) return false;
        return true;
    }

}

app.get('/admin', sendAdmin)

//logout stuff
const sendIndex = (req, res) => {res.redirect('/')} 

app.get('/logout', sendIndex)

// 404 Not found stuff
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/public/404.html'))

//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))