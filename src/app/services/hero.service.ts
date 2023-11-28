import { Injectable, inject } from '@angular/core';
import { Hero } from '../models/hero';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  http: HttpClient = inject(HttpClient)
  messageService: MessageService = inject(MessageService);

  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log("fetched heroes")),
        catchError(this.handlerError<Hero[]>('getHeroes', []))
      )
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handlerError<Hero>(`getHero id=${id}`))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero id=${newHero.id}`)),
      catchError(this.handlerError<Hero>('addHero'))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handlerError<any>('updateHero'))
    )
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handlerError<any>('deleteHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? this.log(`found ${x.length} heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`)),
      catchError(this.handlerError<Hero[]>('searchHeroes', []))
    )
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handlerError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T);
    }
  }
}
