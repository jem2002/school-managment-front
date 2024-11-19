import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) { }

  get isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  ngOnInit(): void {}


  onLogout(): void {
    this.tokenService.onLogout();
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: 'Ha cerrado sesión con éxito',
      showConfirmButton: false,
      timer: 2000
    })
  }
}
