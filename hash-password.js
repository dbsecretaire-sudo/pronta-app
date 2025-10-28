const bcrypt = require('bcrypt');
const password = 'pronta1992';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
