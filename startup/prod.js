const compression = require('compression');
const helmet = require('helmet');

function production(app) {
  app.use(compression());
  app.use(helmet());
}
module.exports = production;
