import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  silent: true,
  defaultMeta: { service: 'eos-evm' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});