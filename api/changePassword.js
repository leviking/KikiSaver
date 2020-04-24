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
        console.log('i died')
        return
        //con.query(noMagicLinkQuery(req.body.newPassword, req.body.userId))
     }
}

const magicLinkQuery = (password, magicLink) => {
    return `UPDATE users SET password = '${password}' WHERE id = (
        SELECT user_id FROM user_resets WHERE reset_key = '${magicLink}' AND deleted_at IS null
        )`
}
const noMagicLinkQuery = (password, userId) => {
    return `UPDATE users SET password = '${password}' WHERE id = '${userId}'`
}
const destroyMagicQuery = resetLink => {
    return `UPDATE user_resets SET deleted_at = now() WHERE reset_key = '${resetLink}'`
}

const hasMagicLink = req => !!req.body.magic

const destroyMagic = resetLink => {
    con.query(destroyMagicQuery(resetLink), (err, results, fields) => (err) ? console.log(err) : console.log(results))
}

resetEmitter.on('successfulReset', destroyMagic)
module.exports = { changePassword }