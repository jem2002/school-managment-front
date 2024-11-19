import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Apoderado } from '../models/apoderado';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {

  private urlEndPoint: string = URL_BACKEND + '/api/apoderados';

  constructor(private http: HttpClient) { }

  getApoderadoByDni(dni: string): Observable<Apoderado> {
    let params = new HttpParams();
    params = params.set('dni', dni);
    return this.http.get<Apoderado>(`${this.urlEndPoint}/findByDni`, {params: params})
               .pipe(
                  catchError(e => {
                    if(e.status == 400){
                    return throwError(e);
                    }
                    return throwError(e);
                  })
    );
  }
}
