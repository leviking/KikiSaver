const path = require('path')
const fs = require('fs')
const { con } = require('./db')
const EventEmitter = require('events');
const loginEmitter = new EventEmitter();

//Login stuff
const sendLogin = (req, res) => res.sendFile(path.join(__dirname, '/../public/login.html'))

const getLoginQuery = (username, password) => {
    return `SELECT id, is_admin, username, first_name FROM users WHERE username='${username}' AND password='${password}'`
}
const getAttendanceQuery = (id, ip, gps) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), '${gps}', '${ip}')`
}
const getAdminQuery = (username, password) => {
    return `SELECT is_admin FROM users WHERE username='${username}' AND password='${password}'`
}
const getSelfieUpdateQuery = (user, selfiePath) => `update attendance set selfie_url='${selfiePath}' where user_id='${user.id}' order by created_at desc limit 1`


const selfieErrorHandler = (err) => console.log(err)
const writeSelfie = (req, res, user, selfie, username) => {
    const timeCode = Date.now()
    const selfiePath = path.join(__dirname + `/../public/selfies/${user.username}/${timeCode}`)
        //console.log(user);
        //console.log(selfie)
    fs.writeFile(selfiePath, selfie.data, selfieErrorHandler)
    loginEmitter.emit('selfieWrite', user, selfiePath)
    loginEmitter.emit('loginSuccess', req, res, selfiePath, username)
}

const updateSelfieUrl = (user, selfiePath) => {
    con.query(getSelfieUpdateQuery(user, selfiePath), selfieErrorHandler)
    con.query(`select * from attendance where user_id='${user.id}' order by created_at desc limit 1`, (err, res, f) => {
        if (err) console.log(err)
            //console.log(res[0])
    })
}
const logAttendance = (user, ip, gps, selfie, req, res) => {
    con.query(getAttendanceQuery(user.id, ip, gps), (err, results, fields) => {
        if (err) {
            console.log(err)
        } else {
            loginEmitter.emit('saveSelfie', req, res, user, selfie, user.first_name)
            console.log('here 2')
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
            loginEmitter.emit('onAdmin', req, res):
                loginEmitter.emit('onLogin', results[0], req.ip, req.body.gps, req.files.selfie, req, res);
        }
    })
}
const sendAdmin = (req, res) => {
    if (con.query(getAdminQuery(req.headers.msuser, req.headers.mspass), (err, results, fields) => {
            if (err) console.log(err)
            if (!results.length || results[0].is_admin == false) {
                console.log({ results: results, status: 'not admin' });
                res.status(401).send('Not admin')
                return
            }
            res.redirect('/admin')
            res.sendFile(path.join(__dirname + '/../public/admin.html'))
        }))
        return
}
loginEmitter.on('onLogin', logAttendance)
loginEmitter.on('onAdmin', (req, res) => {
    //add auth
    res.set({ msuser: req.body.username, mspass: req.body.password }).sendFile(path.join(__dirname, '/../public/admin.html'))
})
loginEmitter.on('saveSelfie', writeSelfie)
loginEmitter.on('selfieWrite', updateSelfieUrl)
loginEmitter.on('loginSuccess', (req, res, selfiePath, username) => {
    res.status(200).send(JSON.stringify({ username: username, selfiePath: selfiePath }));
})
module.exports = { login, sendLogin, sendAdmin }