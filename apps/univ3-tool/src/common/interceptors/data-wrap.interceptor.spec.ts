import { LoggerService } from '../services/logger/logger.service';
import { DataWrapInterceptor } from './data-wrap.interceptor';

describe('DataWrapInterceptor', () => {
  it('should be defined', () => {
    expect(new DataWrapInterceptor(new LoggerService())).toBeDefined();
  });
});
