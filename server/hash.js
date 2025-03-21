const bcrypt = require('bcrypt');
const saltRounds = 10;


bcrypt.hash('liam999', saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password for liam:', hash);
});
