import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';

@Injectable()
export class EvenBetterLoggerService extends LoggerService {
  constructor(private userService: UserService) {
    super();
  }

  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
