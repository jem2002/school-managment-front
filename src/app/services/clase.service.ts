import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_BACKEND } from '../config/config';
import { Asignacion } from '../models/asignacion';
import { Clase } from '../models/clase';
import { Nota } from '../models/nota';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private urlEndPoint: string = URL_BACKEND + '/api/clases';

  constructor(private http: HttpClient) { }

  getClases(): Observable<Clase[]>{
    return this.http.get<Clase[]>(this.urlEndPoint);
  }

  getClase(id: number): Observable<Clase>{
    return this.http.get<Clase>(`${this.urlEndPoint}/${id}`);
  }

  saveClase(clase: Clase): Observable<Clase>{
    return this.http.post<Clase>(this.urlEndPoint+'/crear', clase);
  }

  updateClase(clase: Clase): Observable<Clase>{
    return this.http.put<Clase>(`${this.urlEndPoint}/${clase.id}`, clase);
  }

  deleteClase(id: number): Observable<Clase>{
    return this.http.delete<Clase>(`${this.urlEndPoint}/${id}`)
  }

  subirArchivo(archivoPDF: File, idClase: string, nombreFile: string): Observable<Clase> {
    let formData = new FormData();
    formData.append("archivo", archivoPDF);
    formData.append("idClase", idClase);
    formData.append("nombreFile", nombreFile);

    return this.http.post(`${this.urlEndPoint}/uploads/`, formData).pipe(
              map((response: any) => response.clase as Clase),
              catchError( e => {
                console.error(e.error.mensaje);
                return throwError(e);
              })
            );
  }

  eliminarArchivoPDF(idClase: string, idMaterial: string): Observable<any> {

    let params = new HttpParams();
    params = params.set('idClase', idClase);
    params = params.set('idMaterial', idMaterial);
    return this.http.delete<any>(`${this.urlEndPoint}/eliminarMaterial`, {params: params});
  }

  crearNota(nota: Nota): Observable<Nota>{
    return this.http.post<Nota>(`${this.urlEndPoint}/crearNota`, nota);
  }

  listaAsignacionesPorClase(idClase: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.urlEndPoint}/asignacionesPorClase/${idClase}`);
  }

}
