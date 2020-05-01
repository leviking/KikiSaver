const bcrypt = require('bcrypt');
const saltRounds = 10;

const encrypt = (password, callback) => { 
  bcrypt.hash(password, saltRounds, function(err, hash) {
    if(err) console.log(err);
    callback(hash)
  });
}

const compare = (password, hash, callback) => bcrypt.compare(password, hash, (err, result) => {  
  if(err) console.log(err)
  callback(result)
})

module.exports = { encrypt, compare }