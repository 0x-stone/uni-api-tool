import { Injectable } from '@nestjs/common';

type TLogType = 'info' | 'warn' | 'error';

function firstLetterUppercase(template: TLogType) {
  return template.charAt(0).toUpperCase() + template.slice(1);
}

class Logger {
  type: TLogType;
  constructor(type: TLogType) {
    this.type = type;
  }

  console<T>(...msg: T[]) {
    console[this.type](
      `[${firstLetterUppercase(this.type)}] [TIME]:[${new Date()}]`,
      ...msg,
    );
  }

  sendToRemote<T>(...msg: T[]) {
    return null;
  }
}

function createLogger<T>(type: TLogType) {
  const log = new Logger(type);
  return (...msg: T[]) => {
    log.console(...msg);
  };
}

export const logInfo = createLogger('info');
export const logWarn = createLogger('warn');
export const logError = createLogger('error');

@Injectable()
export class LoggerService {
  public info = logInfo;
  public warn = logWarn;
  public error = logError;
}
