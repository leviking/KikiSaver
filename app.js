const express = require('express')
const db = require('./api/db')
const { login, sendLogin } = require('./api/login')
const { sendSignup, createUser } = require('./api/sign-up')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Splash stuff
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/src/css/style.css', (req, res) => { res.sendFile(__dirname + '/src/css/style.css') })

// Login
app.get('/login', sendLogin)
app.post('/login', login)

//Sign up
app.get('/signup', sendSignup)
app.post('/signup', createUser)

//Admin stuff


const sendAdmin = (req, res) => {

    if (isAdmin) {
        res.sendFile(__dirname + '/public/admin.html')
    } else {
        res.redirect('/')
    }
}

const isAdmin = async(user_id) => {
    let result
    await con.query(`select id from users where is_admin and id='${user_id}'`, (error, results, fields) => {
        if (error) {
            console.log(error)
        } else {
            result = results[0].id
        }
    })
    return result
}

app.get('/admin', sendAdmin)

//logout stuff
const sendIndex = (req, res) => { res.redirect('/') }

app.get('/logout', sendIndex)

// 404 Not found stuff
app.get('*', (req, res) => res.status(404).sendFile(__dirname + '/public/404.html'))

//LISTEN
app.listen(port, () => console.log(`Example app listening on port ${port}!`))