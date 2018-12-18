const { createLogger, format, transports } = require('winston');
// 문제가 생길 경우 삭제

const winston = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  winston.add(new transports.Console({ format: format.simple() }));
}

module.exports = winston;
