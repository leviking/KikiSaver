const bcrypt = require('bcrypt');
const saltRounds = 10;
const EventEmitter = require('events');
// const encryptEmitter = new EventEmitter();


const encrypt = (password, callback) => { 
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err) console.log(err);
    
    
    console.log('encrypt ', password, hash);
    
    callback(hash)
  });
}

// encryptEmitter.on('encrypted', (hash)=>console.log(hash))

module.exports = { encrypt }