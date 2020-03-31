const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const EventEmitter = require('events');
const loginEmitter = new EventEmitter();

//Login stuff
const sendLogin = (req, res) => res.sendFile(path.join(__dirname, '/../public/login.html'))

const getLoginQuery = (username, password) => {
    return `SELECT id, is_admin, username FROM users WHERE username='${username}' AND password='${password}'`
}
const getAttendanceQuery = (id, ip, gps) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), '${gps}', '${ip}')`
}
const getAdminQuery = (username, password) => {
    return `SELECT is_admin FROM users WHERE username='${username}' AND password='${password}'`
}

const getSelfieUpdateQuery = (user, selfiePath) => `update attendance set selfie_url='${selfiePath}' where user_id='${user.id}' order by created_at desc limit 1`


const selfieErrorHandler = (err) => console.log(err)
const writeSelfie = (user, selfie) => {
    const timeCode = Date.now()
    const selfiePath = path.join(__dirname + `/../public/selfies/${user.username}/${timeCode}`)
    console.log(user);
    console.log(selfie)
    fs.writeFile(selfiePath, selfie.data, selfieErrorHandler)
    loginEmitter.emit('selfieWrite', user, selfiePath)
}

const updateSelfieUrl = (user, selfiePath) => {
    con.query(getSelfieUpdateQuery(user, selfiePath), selfieErrorHandler)
    con.query(`select * from attendance where user_id='${user.id}' order by created_at desc limit 1`, (err, res, f) => {
        if (err) console.log(err)
        console.log(res[0])
    })
}

const logAttendance = (user, ip, gps, selfie, res) => {
    con.query(getAttendanceQuery(user.id, ip, gps), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            loginEmitter.emit('loginSuccess', res)
            loginEmitter.emit('saveSelfie', user, selfie)
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
            loginEmitter.emit('onAdmin', req, res, req.body.username, req.body.password):
                loginEmitter.emit('onLogin', results[0].id, req.ip, req.body.gps, res);
        }
    })
}

const sendAdmin = (req, res) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (con.query(getAdminQuery(login, password), (err, results, fields) => {
            if (err) console.log(err)
            if (!results.length || results[0].is_admin == false) {
                console.log({ results: results, status: 'not admin' });
                res.status(401).send('Not admin')
                return
            }
            res.sendFile(path.join(__dirname + '/../public/admin.html'))
        }))
        return
}

loginEmitter.on('onLogin', logAttendance)
loginEmitter.on('onAdmin', (req, res, userName, password) => {
    const encodedCreds = Buffer.from(`${userName}:${password}`).toString('base64')
    res.set('Authorization', `Basic ${encodedCreds}`).sendFile(path.join(__dirname + '/../public/admin.html'));
})
loginEmitter.on('saveSelfie', writeSelfie)
loginEmitter.on('selfieWrite', updateSelfieUrl)
loginEmitter.on('loginSuccess', (res) => {
    res.sendFile(path.join(__dirname, '/../public/success.html'))
})
module.exports = { login, sendLogin, sendAdmin }