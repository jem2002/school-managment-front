import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private urlEndPoint: string = URL_BACKEND + '/api/cursos';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<Curso[]> {
    return this.http.get<[]>(this.urlEndPoint);
  }

  getCurso(id:number): Observable<Curso>{
    return this.http.get<Curso>(`${this.urlEndPoint}/${id}`);
  }

  saveCurso(curso: Curso): Observable<Curso>{
    return this.http.post<Curso>(this.urlEndPoint+'/crear', curso);
  }

  updateCurso(curso: Curso): Observable<Curso>{
    return this.http.put<Curso>(`${this.urlEndPoint}/${curso.id}`, curso);
  }

  deleteCurso(curso: Curso) : Observable<Curso> {
    return this.http.delete<Curso>(`${this.urlEndPoint}/${curso.id}`)
  }

}
