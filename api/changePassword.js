const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();
const { encrypt, compare } = require('./encrypt')



const changePassword = (req, res) => {
    
    if (hasMagicLink(req)) {
        con.query(magicLinkQuery(req.body.newPassword, req.body.magic), (err, results, fields) => {
            if (err) {
                console.log(err)
                res.status(400).send('err')
            } else {
                if (results.affectedRows == 0) {
                    res.status(403).send('noKeyMatch')
                    return
                }
                resetEmitter.emit('successfulReset', req.body.magic)
                res.status(200).send('ok')
                console.log(results)
            }
        })

    } else {
        const getPassword = (username, callback) => {
            con.query(`select password from users where username='${username}'`,
                (err, results) => {
                    console.log(results[0].password);
                    
                    if(err) {console.log(err)
                    }else{
                        callback(results[0].password)
                    }
                }
            )
        }
        
        const getUser = (username, callback) => {
            con.query(`select * from users where username='${username}'`,
            (err, results) => {
                if(err) {
                    console.log(err)
                } else {
                    callback(results[0])
                }
            }
            )
        }

        const compareWithPass = (oldPassword, callback) => (dbPass) => {
            console.log(dbPass);
            
            compare(oldPassword, dbPass, callback)
        }
        const decodedOldPass =  Buffer.from(req.body.oldPassword, 'base64').toString()
        const updatePasswordWithNewPassword = (res, req) => (password) => {
            con.query(noMagicLinkQuery(password, req.body.username), (error, results, fields) => {
                if (error) {
                    res.status(400).send(`${JSON.stringify(error)}.`);
                    return;
                };
                if (results) {
                        //res.redirect('/');
                    res.status(200).send('Ok');
                }
            })
        }
        const handleChangePassword = (results) => {
            results ?
            getUser(req.body.username) :
            res.status(401).send('Password incorrect')
        }
        getPassword(req.body.username, compareWithPass(decodedOldPass, handleChangePassword))
        encrypt(
            Buffer.from(req.body.newPassword, 'base64').toString(), 
            updatePasswordWithNewPassword(res,req)
        )
     }
}

const magicLinkQuery = (password, magicLink) => {
    return `UPDATE users SET password = '${password}' WHERE id = (
        SELECT user_id FROM user_resets WHERE reset_key = '${magicLink}' AND deleted_at IS null
        )`
}
const noMagicLinkQuery = (password, username) => {

    return `UPDATE users SET password = '${password}' WHERE username = '${username}'`
}
const destroyMagicQuery = resetLink => {
    return `UPDATE user_resets SET deleted_at = now() WHERE reset_key = '${resetLink}'`
}

const hasMagicLink =  

const destroyMagic = resetLink => {
    con.query(destroyMagicQuery(resetLink), (err, results, fields) => (err) ? console.log(err) : console.log(results))
}

resetEmitter.on('successfulReset', destroyMagic)
module.exports = { changePassword }
