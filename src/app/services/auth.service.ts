import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDto } from '../auth/models/jwt-dto';
import { LoginUsuario } from '../auth/models/login-usuario';
import { NuevoUsuario } from '../auth/models/nuevo-usuario';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = URL_BACKEND + '/auth/';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http:HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario ): Observable<any>{
    return this.http.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario ): Observable<JwtDto>{
    return this.http.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }

  public refreshToken(dto: JwtDto): Observable<JwtDto> {
    return this.http.post<JwtDto>(this.authURL + 'refresh', dto);
  }
  
  
}
