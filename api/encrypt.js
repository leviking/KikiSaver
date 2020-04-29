const bcrypt = require('bcrypt');
const saltRounds = 10;
const EventEmitter = require('events');

const encrypt = (password, callback) => { 
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err) console.log(err);
    console.log(hash)    
    callback(hash)
  });
}

module.exports = { encrypt }