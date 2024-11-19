import { Component, OnInit } from '@angular/core';
import { Nota } from 'src/app/models/nota';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-estudiante-notas',
  templateUrl: './estudiante-notas.component.html',
  styleUrls: ['./estudiante-notas.component.css']
})
export class EstudianteNotasComponent implements OnInit {

  notas: Nota[] = [];
  NOTA_APROBATORIA: number = 13;

  constructor(private tokenService:TokenService, private estudianteService:EstudianteService) { }

  ngOnInit(): void {
    this.estudianteService.getEstudianteByDni(this.tokenService.getUsername())
        .subscribe((response: any) => this.notas = response.estudiante.notas);
  }

}
