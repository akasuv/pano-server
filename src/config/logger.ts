import pino from "pino-http";

export const logMiddleware = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const logger = logMiddleware.logger;

export default logger;
