const compression = require('compression');
const helmet = require('helmet');

// Activate in production
function production(app) {
  app.use(compression());
  app.use(helmet());
}
module.exports = production;
