import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class EstudianteGuardService implements CanActivate {

  realRol: string;

  constructor(private tokenService: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRol = route.data.expectedRol;
    const roles = this.tokenService.getAuthorities();
    this.realRol = 'ADMIN';

    roles.forEach(rol => {
      if(rol === 'ROLE_ADMIN'){
        this.realRol = 'ADMIN';
      }
      if(rol === 'ROLE_PROFESOR'){
        this.realRol = 'PROFESOR';
      }
      if(rol === 'ROLE_ESTUDIANTE'){
        this.realRol = 'ESTUDIANTE';
      }
    });
    
    if(expectedRol.indexOf(this.realRol) === -1){
      Swal.fire('Sin accesos', 'No tienes accesos a esa ruta','info')
      this.tokenService.setDashboardTrue();
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    if(!this.tokenService.getToken()) {
      Swal.fire('Ocurrió algo', 'Ingrese nuevamente','warning')
      this.tokenService.onLogout();
      return false;
    }

    return true;

  }

}

