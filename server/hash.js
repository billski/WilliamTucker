const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash for tippy
bcrypt.hash('tippy999', saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password for tippy:', hash);
});

// Hash for dad
bcrypt.hash('wtucker999', saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password for dad:', hash);
});
