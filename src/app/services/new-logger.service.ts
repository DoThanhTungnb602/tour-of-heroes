import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class NewLoggerService extends LoggerService {
  constructor() {
    super();
  }

  override log(message: string): void {
    super.log(`New Logger: ${message}`);
  }
}
