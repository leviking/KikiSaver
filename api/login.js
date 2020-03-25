const path = require('path')
const { con } = require('./db')
const EventEmitter = require('events');
const loginEmitter = new EventEmitter();

//Login stuff
const sendLogin = (req, res) => res.sendFile(path.join(__dirname + '/../public/login.html'))

const getLoginQuery = (username, password) => {
    return `SELECT id, is_admin FROM users WHERE username='${username}' AND password='${password}'`
}
const getAttendanceQuery = (id, ip, gps) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), '${gps}', '${ip}')`
}
const logAttendance = (id, ip, gps, res) => {
    con.query(getAttendanceQuery(id, ip, gps), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            loginEmitter.emit('loginSuccess', res)
        }
    })
}
const login = (req, res) => {
    con.query(getLoginQuery(req.body.username, req.body.password), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else if (!results.length) {
            // username and password do not match!
            res.send('no results')
        } else {
            (results[0].is_admin == true) ?
                loginEmitter.emit('onAdmin', res):
                loginEmitter.emit('onLogin', results[0].id, req.ip, req.body.gps, res);
        }
    })
}

loginEmitter.on('onLogin', logAttendance)
loginEmitter.on('onAdmin', (res) => {
    //add auth
    res.sendFile(path.join(__dirname + '/../public/admin.html'))
})
loginEmitter.on('loginSuccess', (res) => {
    res.sendFile(path.join(__dirname + '/../public/success.html'))
})
module.exports = { login, sendLogin }