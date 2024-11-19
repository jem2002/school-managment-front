import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_BACKEND } from '../config/config';
import { Grado } from '../models/grado';

@Injectable({
  providedIn: 'root'
})
export class GradoService {

  private urlEndPoint: string = URL_BACKEND + '/api/grados';

  constructor(private http:HttpClient) { }

  getGrados(): Observable<Grado[]>{
    return this.http.get<Grado[]>(`${this.urlEndPoint}`);
  }

  getGrado(id:number): Observable<Grado>{
    return this.http.get<Grado>(`${this.urlEndPoint}/${id}`);
  }

  saveGrado(grado: Grado): Observable<Grado>{
    return this.http.post<Grado>(this.urlEndPoint+'/crear', grado);
  }

  updateGrado(grado: Grado): Observable<Grado>{
    return this.http.put<Grado>(`${this.urlEndPoint}/${grado.id}`, grado);
  }

  deleteGrado(grado: Grado): Observable<Grado> {
    return this.http.delete<Grado>(`${this.urlEndPoint}/${grado.id}`);
  }
}
