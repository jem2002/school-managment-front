import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Aula } from '../models/aula';
import { Clase } from '../models/clase';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  private urlEndPoint: string = URL_BACKEND + '/api/aulas';

  constructor(private http: HttpClient) { }

  getAulas(): Observable<Aula[]>{
    return this.http.get<Aula[]>(this.urlEndPoint);
  }

  getEstudiantesAula(id: string): Observable<Estudiante[]>{
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<Estudiante[]>(this.urlEndPoint+'/estudiantes', {params: params});
  }

  getClasesAula(id: string): Observable<Clase[]>{
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<Clase[]>(this.urlEndPoint+'/clases', {params: params});
  }

  getAula(id:number): Observable<Aula>{
    return this.http.get<Aula>(`${this.urlEndPoint}/${id}`);
  }

  saveAula(aula: Aula): Observable<Aula>{
    return this.http.post<Aula>(this.urlEndPoint+'/crear', aula);
  }

  updateAula(aula: Aula): Observable<Aula>{
    return this.http.put<Aula>(`${this.urlEndPoint}/${aula.id}`, aula);
  }

}
