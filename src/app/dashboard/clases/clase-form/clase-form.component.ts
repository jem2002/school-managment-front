import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clase } from 'src/app/models/clase';
import { Curso } from 'src/app/models/curso';
import { DiaSemana } from 'src/app/models/dia-semana';
import { Empleado } from 'src/app/models/empleado';
import { Frecuencia } from 'src/app/models/frecuencia';
import { ClaseService } from 'src/app/services/clase.service';
import { CursoService } from 'src/app/services/curso.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';

@Component({
  selector: 'app-clase-form',
  templateUrl: './clase-form.component.html',
  styleUrls: ['./clase-form.component.css']
})
export class ClaseFormComponent implements OnInit {

  idClase: string = '';
  idAula: string = '';

  claseEncontrada: Clase = new Clase();
  cursos: Curso[] = [];
  empleados: Empleado[] = [];
  frecuencias: Frecuencia[] = [];
  dias: DiaSemana[] = [];
  inicio_horas: string[] = ['07:00 AM','08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 AM','13:00 PM','14:00 PM','15:00 PM','16:00 PM','17:00 PM','18:00 PM', '19:00 PM'];

  constructor(private cursoService: CursoService,
              private activatedRoute: ActivatedRoute,
              private empleadoService: EmpleadoService,
              private matriculaService: MatriculaService,
              private router: Router,
              private claseService: ClaseService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.activatedRoute.params
        .subscribe(params => {
          this.idClase = params['idClase'];
          this.idAula = params['idAula'];
          if(this.idClase){
            this.claseService.getClase(+this.idClase)
                .subscribe(response => {
                  this.claseEncontrada = response;
                  this.cursoService.getCursos().subscribe(response => this.cursos = response);
                  this.empleadoService.getEmpleados().subscribe(response => this.empleados = response);
                  this.matriculaService.getDias().subscribe(response => this.dias = response);
                  this.frecuencias = this.claseEncontrada.frecuencias;
                })
          }
        })
  }

  actualizarClase(): void {

    this.claseEncontrada.frecuencias = this.frecuencias;

    this.claseService.updateClase(this.claseEncontrada)
        .subscribe(response => {
          this.router.navigate([`/dashboard/aulas/form/${this.idAula}`]);
        })
    
    
  }

  agregarFrecuencia(): void {
    let frecuencia: Frecuencia = new Frecuencia();
    this.frecuencias.push(frecuencia);
  }

  quitarFrecuencia(frecuencia: Frecuencia): void {
    const index = this.frecuencias.indexOf(frecuencia);
    
    if(index > -1){
      this.frecuencias.splice(index, 1);
    }
  }

    compararCurso(o1: Curso, o2:Curso): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararEmpleado(o1: Empleado, o2:Empleado): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararDiasemana(o1: DiaSemana, o2:DiaSemana): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id == o2.id;
  }

  compararHora(o1:string, o2:string): boolean{
    if(o1 === undefined && o2 === undefined) return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1 == o2;
  }

}
