const winston = require('winston');
require('winston-mongodb');
/* EXPRESS ASYNC ERROR HANDLING */
require('express-async-errors');

function logger() {
  const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.align(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  );

  const myformatLog = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.align(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  );
  /* HANDLE NODE ERRORS ON STARTUP */
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );
  process.on('unhandledRejection', (err) => {
    throw err;
  });

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      level: 'error',
      format: myformatLog,
    })
  );
  winston.add(
    new winston.transports.Console({
      level: 'info',
      format: myformat,
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/s-movie',
      options: {
        useUnifiedTopology: true,
      },
      level: 'error',
    })
  );
}
module.exports = logger;
