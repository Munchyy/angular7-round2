import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { isNgTemplate } from '@angular/compiler';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': "application/json"}),
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private heroesUrl = 'api/heroes';

  private log(message: string): void {
    this.messageService.add(message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T);
    }
  }

  getHeroes() : Observable<Hero[]> {
    this.log('HeroService: Fetched Heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log('fetched Heroes')),
      catchError(this.handleError('getHeroes', []))
    );
  }

  getHero(id) : Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => this.log(`fetched hero with id: ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(() => this.log(`updated hero with id ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap(() => this.log(`added hero with id ${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero) {
    return this.http.delete<Hero>(`${this.heroesUrl}/${hero.id}`, httpOptions).pipe(
      tap(() => this.log(`deleted ${hero.name}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(() => this.log(`found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes'))
    );
  }
}
