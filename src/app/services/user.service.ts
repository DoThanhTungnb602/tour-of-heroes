import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user = { name: 'Do Thanh Tung', isAuthorized: true };

  constructor() {}
}
