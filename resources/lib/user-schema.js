var J = require('jski')();

module.exports = J

  .object({
    username: J.string(),
    password: J.string().custom('view', { type: 'cr-password' }),
    role: J.enum('none', 'admin', 'editor')

  }).required('username', 'password', 'role')
;
