import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Aula } from 'src/app/models/aula';
import { Estudiante } from 'src/app/models/estudiante';
import { Grado } from 'src/app/models/grado';
import { Nivel } from 'src/app/models/nivel';
import { Turno } from 'src/app/models/turno';
import { AulaService } from 'src/app/services/aula.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { GradoService } from 'src/app/services/grado.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  estudiante: Estudiante = new Estudiante();
  aulas: Aula[] = [];
  grados: Grado[] = [];
  errores: string[] = [];
  niveles: Nivel[] = [];
  turnos: Turno[] = [];
  sexo: string[] = ['MASCULINO', 'FEMENINO'];

  maxDate: Date;
  locale = 'es';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private estudianteService: EstudianteService,
              private datePipe: DatePipe,
              private aulaService: AulaService,
              private gradoService: GradoService,
              private router: Router,
              private matriculaService: MatriculaService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.bsConfig = Object.assign({dateInputFormat: 'YYYY/MM/DD'}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});
    this.cargarEstudiante();

    this.gradoService.getGrados().subscribe(response => this.grados = response);
    this.matriculaService.getNiveles().subscribe(response => this.niveles = response);
    this.matriculaService.getTurnos().subscribe(response => this.turnos = response);
    this.aulaService.getAulas()
        .subscribe(response => {
          this.aulas = response;
        });
  }

  cargarEstudiante(){
    this.activatedRoute.params
        .subscribe(params => {
          let id:number = +params['id'];

          if(id){
            this.estudianteService.getEstudiante(id)
                .subscribe(response => this.estudiante = response);
          }
        })
  }

  actualizar(){
    this.estudiante.fechaNacimiento = this.datePipe.transform(this.estudiante.fechaNacimiento, 'yyyy-MM-dd');
    this.estudianteService.updateEstudianteSinAsistencia(this.estudiante)
        .subscribe(response => {
          this.router.navigate(['/dashboard/estudiantes/page/0']);
          Swal.fire(
            'Estudiante actualizado',
            'El estudiante se ha actualizado con éxito',
            'success'
          )
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log(this.errores)
        }
        );
  }

  compararAula(o1: Aula, o2:Aula): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararGrado(o1: Grado, o2:Grado): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararTurno(o1: Turno, o2:Turno): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararNivel(o1: Nivel, o2:Nivel): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

}
