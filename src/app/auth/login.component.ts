import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { LoginUsuario } from './models/login-usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUsuario: LoginUsuario = new LoginUsuario();
  errorMensaje: string;
  isLogged = false;

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
  }

  get isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  backToMenu(){
    this.router.navigate(['/dashboard']);
    this.tokenService.setDashboardTrue();
  }

  onLogin(): void{
    this.authService.login(this.loginUsuario)
        .subscribe((response: any) => {
          this.tokenService.setToken(response.jwtDto.token);
          this.tokenService.setDashboardTrue();
          const token = response.jwtDto.token;
          const payload = token.split('.')[1];
          const payloadDecoded = JSON.parse(atob(payload));
          const roles = payloadDecoded.roles;

          this.tokenService.setAuthorities(roles);
          this.isLogged = true;
          

          this.router.navigate(['/dashboard']);

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ha iniciado sesión con éxito',
            showConfirmButton: false,
            timer: 2000
          })
        },
        err => {
          this.isLogged = false;
          this.errorMensaje = 'Usuario o contraseña incorrectos.';
        }
        );
  }

}
