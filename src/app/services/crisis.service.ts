import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from './message.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { Crisis } from '../models/crisis';

@Injectable({
  providedIn: 'root',
})
export class CrisisService {
  private http: HttpClient = inject(HttpClient);
  private messageService: MessageService = inject(MessageService);
  private crisisUrl = 'api/crisis';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getCrises(): Observable<Crisis[]> {
    return this.http.get<Crisis[]>(this.crisisUrl).pipe(
      tap((_) => this.log('fetched crisis')),
      catchError(this.handlerError<Crisis[]>('getCrisis', []))
    );
  }

  getCrisis(id: number): Observable<Crisis> {
    const url = `${this.crisisUrl}/${id}`;
    return this.http.get<Crisis>(url).pipe(
      tap((_) => this.log(`fetched Crisis id=${id}`)),
      catchError(this.handlerError<Crisis>(`getCrisis id=${id}`))
    );
  }

  addCrisis(Crisis: Crisis): Observable<Crisis> {
    return this.http
      .post<Crisis>(this.crisisUrl, Crisis, this.httpOptions)
      .pipe(
        tap((newCrisis: Crisis) => this.log(`added Crisis id=${newCrisis.id}`)),
        catchError(this.handlerError<Crisis>('addCrisis'))
      );
  }

  updateCrisis(Crisis: Crisis): Observable<any> {
    return this.http.put(this.crisisUrl, Crisis, this.httpOptions).pipe(
      tap((_) => this.log(`updated Crisis id=${Crisis.id}`)),
      catchError(this.handlerError<any>('updateCrisis'))
    );
  }

  deleteCrisis(id: number): Observable<any> {
    const url = `${this.crisisUrl}/${id}`;
    return this.http.delete<Crisis>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted Crisis id=${id}`)),
      catchError(this.handlerError<any>('deleteCrisis'))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handlerError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
