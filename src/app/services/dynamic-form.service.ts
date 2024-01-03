import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from '../app.config';
import { Observable } from 'rxjs';
import { JsonFormData } from '../dynamic-form/form/form.component';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  public getFormData(): Observable<JsonFormData> {
    return this.http.get(
      this.config.baseApiUrl + '/form-data'
    ) as Observable<JsonFormData>;
  }
}
