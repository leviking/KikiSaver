const { con } = require('./db')
const EventEmitter = require('events');
const resetEmitter = new EventEmitter();


const changePassword = (req, res) => {
    
    if (hasMagicLink(req)) {
        con.query(magicLinkQuery(req.body.newPassword, req.body.magic), (err, results, fields) => {
            if (err) {
                console.log(err)
                res.status(400).send('err')
            } else {
                res.status(200).send('ok')
                console.log(results)
            }
        })
    } else {
        console.log('i died')
        return
        //con.query(noMagicLinkQuery(req.body.newPassword, req.body.userId))
     }

}

const magicLinkQuery = (password, magicLink) => {
    return `UPDATE users SET password = '${password}' WHERE id = (
        SELECT user_id FROM user_resets WHERE reset_key = '${magicLink}'
        )`
}
const noMagicLinkQuery = (password, userId) => {
    return `UPDATE users SET password = '${password}' WHERE id = '${userId}'`
}

const hasMagicLink = req => !!req.body.magic

//resetEmitter.on('successfulReset', resetKey)
module.exports = { changePassword }