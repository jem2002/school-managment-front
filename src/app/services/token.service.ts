import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';
const AUTHORITIES_KEY = 'AuthAuthorities';

let dashboard = 'dashboard';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(private router: Router) { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setDashboardFalse(): void {
    window.sessionStorage.removeItem(dashboard);
    window.sessionStorage.setItem(dashboard, 'INACTIVO');
  }

  public setDashboardTrue(): void {
    window.sessionStorage.removeItem(dashboard);
    window.sessionStorage.setItem(dashboard, 'ACTIVO');
  }

  public getDashboard(): string {
    return sessionStorage.getItem(dashboard);
  }

  public isDashboardActivo(): boolean {
    return this.getDashboard() == 'ACTIVO' ? true : false;
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    if(sessionStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY))
          .forEach(auth => this.roles.push(auth));
    }

    return this.roles;
  }

  public getUsername(): string {

    if(!this.isAuthenticated()) return null;

    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = JSON.parse(atob(payload));
    const username = payloadDecoded.sub;

    return username;
  }

  public isAdmin(): boolean {

    if(!this.isAuthenticated()) return false;

    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = JSON.parse(atob(payload));
    const roles = payloadDecoded.roles;

    if(roles.indexOf('ROLE_ADMIN') < 0){
      return false;
    }

    return true;
  }

  public isProfesor(): boolean {

    if(!this.isAuthenticated()) return false;

    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = JSON.parse(atob(payload));
    const roles = payloadDecoded.roles;

    if(roles.indexOf('ROLE_PROFESOR') < 0){
      return false;
    }

    return true;
  }

  public isEstudiante(): boolean {

    if(!this.isAuthenticated()) return false;

    const token = this.getToken();
    const payload = token.split('.')[1];
    const payloadDecoded = JSON.parse(atob(payload));
    const roles = payloadDecoded.roles;

    if(roles.indexOf('ROLE_ESTUDIANTE') < 0){
      return false;
    }

    return true;
  }


  public isAuthenticated(): boolean {
    if(this.getToken()){
      return true;
    }else{
      return false;
    }
  }

  public onLogout(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/'])
  }

}
