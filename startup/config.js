const config = require('config');

function configInitiate() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }
}

module.exports = configInitiate;
