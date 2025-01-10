import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // Default
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'app.log' }), // Log to a file
  ],
});

export default logger;
