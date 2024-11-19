import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Asignacion } from '../models/asignacion';
import { RespuestaAsignacion } from '../models/respuesta-asignacion';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  private urlEndPoint: string = URL_BACKEND + '/api/asignaciones';

  constructor(private http: HttpClient) { }

  getAsignacion(idAsignacion: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.urlEndPoint}/${idAsignacion}`);
  }

  saveAsignacion(asignacion: Asignacion, idClase: number): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${this.urlEndPoint}/crear/${idClase}`, asignacion);
  }

  updateAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.urlEndPoint}/actualizar/${asignacion.id}`, asignacion);
  }

  deleteAsignacion(idAsignacion: number): Observable<Asignacion> {
    return this.http.delete<Asignacion>(`${this.urlEndPoint}/${idAsignacion}`);
  }

  getRespuestasAsignacion(idAsignacion: number): Observable<RespuestaAsignacion[]> {
    return this.http.get<RespuestaAsignacion[]>(`${this.urlEndPoint}/respuestas/${idAsignacion}`);
  }

  saveRespuestaAsignacion(idAsignacion: string, archivo: File, dniEstudiante: string): Observable<RespuestaAsignacion> {
    let formData = new FormData();
    formData.append("idAsignacion", idAsignacion);
    formData.append("archivo", archivo);
    formData.append("dniEstudiante", dniEstudiante);
    return this.http.post<RespuestaAsignacion>(`${this.urlEndPoint}/respuestas/crear`, formData);
  }

  findRespuestaEstudiante(dniEstudiante: string, idAsignacion: string): Observable<any> {
    let params = new HttpParams();
    params = params.set("dniEstudiante", dniEstudiante);
    params = params.set("idAsignacion", idAsignacion);

    return this.http.get<any>(`${this.urlEndPoint}/respuestas/buscarRespuesta`, {params: params});
  }

  updateRespuestaEstudiante(nota: string, idRespuesta: number): Observable<RespuestaAsignacion> {
    let formData = new FormData();
    formData.append("nota", nota);
    return this.http.put<RespuestaAsignacion>(`${this.urlEndPoint}/respuestas/${idRespuesta}`, formData);
  }

  deleteRespuestaEstudiante(idRespuesta: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.urlEndPoint}/respuestas/${idRespuesta}`);
  }
  

}
