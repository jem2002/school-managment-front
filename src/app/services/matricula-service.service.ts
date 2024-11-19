import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Asistencia } from '../models/asistencia';
import { DiaSemana } from '../models/dia-semana';
import { Matricula } from '../models/matricula';
import { Nivel } from '../models/nivel';
import { Nota } from '../models/nota';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private urlEndPoint: string = URL_BACKEND + '/api/matriculas';

  constructor(private http: HttpClient) { }

  saveMatricula(matricula: Matricula): Observable<Matricula>{
    return this.http.post<Matricula>(this.urlEndPoint+'/crear', matricula);
  }

  getMatriculasPorEstudiante(id: string): Observable<Matricula[]>{
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<Matricula[]>(this.urlEndPoint+'/matriculasPorEstudiante', {params: params});
  }

  getTurnos(): Observable<Turno[]>{
    return this.http.get<Turno[]>(this.urlEndPoint+'/turnos');
  }

  getNiveles(): Observable<Nivel[]>{
    return this.http.get<Nivel[]>(this.urlEndPoint+'/niveles');
  }

  getDias(): Observable<DiaSemana[]>{
    return this.http.get<DiaSemana[]>(this.urlEndPoint+'/dias');
  }

  getNotas(idCurso: string, idAula: string): Observable<Nota[]>{
    let params = new HttpParams();
    params = params.set('idCurso', idCurso);
    params = params.set('idAula', idAula);
    return this.http.get<Nota[]>(this.urlEndPoint+'/notas', {params: params});
  }

  actualizarNotas(notas: Nota[]): Observable<Nota[]>{
    return this.http.put<Nota[]>(this.urlEndPoint+"/notas", notas);
  }


  getAsistenciasPorDia(fecha: string): Observable<any>{
    let params = new HttpParams();
    params = params.set('fecha', fecha);
    return this.http.get<any>(`${this.urlEndPoint}/getAsistenciasPorDia`, {params: params});
  }

  getCursoReporte(idCurso: string, idGrado: string, bimestre: string): Observable<any>{
    let params = new HttpParams();
    params = params.set('idCurso', idCurso);
    params = params.set('idGrado', idGrado);
    params = params.set('bimestre', bimestre);
    return this.http.get<any>(`${this.urlEndPoint}/getCursoReporte`, {params: params});
  }
  
  getAsistenciasFechaAula(fecha: string, idAula: string): Observable<Asistencia[]>{
    let params = new HttpParams();
    params = params.set('fecha', fecha);
    params = params.set('idAula', idAula);
    return this.http.get<Asistencia[]>(`${this.urlEndPoint}/getAsistenciasFechaAula`, {params: params});
  }

  updateAsistencias(asistencias: Asistencia[]): Observable<Asistencia[]> {
    return this.http.put<Asistencia[]>(`${this.urlEndPoint}/updateAsistencias`, asistencias);
  }
}
