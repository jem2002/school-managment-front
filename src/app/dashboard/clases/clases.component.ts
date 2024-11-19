import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Clase } from 'src/app/models/clase';
import { DiaSemana } from 'src/app/models/dia-semana';
import { Frecuencia } from 'src/app/models/frecuencia';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {

  clases: Clase[] = [];
  diasSemana: DiaSemana[] = [];
  idAula: string;

  constructor(private aulaService: AulaService,
              private activatedRoute: ActivatedRoute,
              private matriculaService: MatriculaService) { }

  ngOnInit(): void {
    this.cargarClases();
    this.matriculaService.getDias().subscribe(response => this.diasSemana = response);
  }

  cargarClases(): void {
    this.activatedRoute.params
        .subscribe(params => {
          this.idAula = params['idAula'];
          this.aulaService.getClasesAula(this.idAula)
        .subscribe(response => {
          this.clases = response;
        });
        })
  }



}
