import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { URL_BACKEND } from '../config/config';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private urlEndPoint: string = URL_BACKEND + '/api/estudiantes';

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<any>{
    return this.http.get(this.urlEndPoint)
               .pipe(
                 map((response: any) => {
                   response.content as Estudiante[];
                   return response;
                 })
               )
  }

  getEstudiantesPage(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map((response: any) => {
        response.content as Estudiante[];
        return response;
      })
    );
  }

  getEstudianteByDni(dni: string): Observable<Estudiante> {
    let params = new HttpParams();
    params = params.set('dni', dni);
    return this.http.get<Estudiante>(`${this.urlEndPoint}/porDni`, {params: params});
  }

  saveEstudiante(estudiante: Estudiante): Observable<Estudiante>{
    return this.http.post<Estudiante>(this.urlEndPoint+'/crear', estudiante)
               .pipe(
                 catchError(e => {
                   if(e.status == 400){
                    return throwError(e);
                   }

                   console.log(e.error.mensaje)
                   console.error(e.error.errors)

                   return throwError(e);
                 })
               );
  }

  actualizarAsistencia(estudiantes: Estudiante[]): Observable<Estudiante[]>{
    return this.http.put<Estudiante[]>(this.urlEndPoint+'/actualizarEstudiantes', estudiantes)
               .pipe(
                 catchError(e => {
                   if(e.status == 400){
                    return throwError(e);
                   }

                   console.log(e.error)
                   

                   return throwError(e);
                 })
               );
  }

  getEstudiante(id: number): Observable<Estudiante>{
    return this.http.get<Estudiante>(`${this.urlEndPoint}/${id}`);
  }

  updateEstudiante(estudiante: Estudiante): Observable<Estudiante>{
    return this.http.put<Estudiante>(`${this.urlEndPoint}/${estudiante.id}`, estudiante)
               .pipe(
                catchError(e => {
                  if(e.status == 400){
                   return throwError(e);
                  }

                  console.log(e.error.mensaje)
                  console.error(e.error.errors)

                  return throwError(e);
                })
              );
  }

  
  updateEstudianteSinAsistencia(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.urlEndPoint}/actualizarSinAsistencia/${estudiante.id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<Estudiante>{
    return this.http.delete<Estudiante>(`${this.urlEndPoint}/${id}`);
  }
}
