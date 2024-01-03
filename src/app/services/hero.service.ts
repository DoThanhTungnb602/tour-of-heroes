import { Injectable, inject } from '@angular/core';
import { Hero } from '../models/hero';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP_CONFIG } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private http: HttpClient = inject(HttpClient);
  private messageService: MessageService = inject(MessageService);
  private config = inject(APP_CONFIG);
  private heroesUrl = `${this.config.baseApiUrl}/heroes`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-token',
    }),
  };
  private heroesSubject$ = new BehaviorSubject(null);
  private heroes$ = this.heroesSubject$.pipe(
    switchMap(() => this.http.get<Hero[]>(this.heroesUrl)),
    catchError(this.handlerError<Hero[]>('getHeroes', []))
  );

  getHeroes(): Observable<Hero[]> {
    return this.heroes$;
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(url)
      .pipe(catchError(this.handlerError<Hero>(`getHero id=${id}`)));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.heroesSubject$.next(null)),
      catchError(this.handlerError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .pipe(catchError(this.handlerError<any>('updateHero')));
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handlerError<any>('deleteHero')),
      tap(() => this.heroesSubject$.next(null))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);
    const options = { params: new HttpParams().set('name', term) };
    return this.http
      .get<Hero[]>(this.heroesUrl, options)
      .pipe(catchError(this.handlerError<Hero[]>('searchHeroes', [])));
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
