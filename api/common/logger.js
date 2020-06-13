/** Componente de LOG envía a Consola para ser recolectado por driver Docker 
*/
const winston = require('winston');
const os = require('os');

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} [bigfinite] @${os.hostname()} ${info.level.padStart(6)}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    format.simple(),
    myFormat,
  ),
  defaultMeta: { service: process.env.APP_ID },
  transports: [new transports.Console()],
  level: process.env.LOG_LEVEL || 'debug',
});

module.exports = logger;
