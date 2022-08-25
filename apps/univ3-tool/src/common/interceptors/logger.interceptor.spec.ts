import { LoggerService } from '../services/logger/logger.service';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggerInterceptor(new LoggerService())).toBeDefined();
  });
});
