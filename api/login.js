const path = require('path')
const { con } = require('./db')
    //Login stuff
const sendLogin = (req, res) => res.sendFile(path.join(__dirname + '/../public/login.html'))

const getLoginQuery = (username, password) => {
    return `SELECT id FROM users WHERE username='${username}' AND password='${password}'`
}
const getAttendanceQuery = (id, ip) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), 0, '${ip}')`
}
const logAttendance = (id, ip) => {
    con.query(getAttendanceQuery(id, ip), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            return true;
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
            if (logAttendance(results[0].id, req.ip)) res.sendFile(__dirname + '/public/success.html')
                // user is logged in
        }
    })
}

module.exports = { login, sendLogin }