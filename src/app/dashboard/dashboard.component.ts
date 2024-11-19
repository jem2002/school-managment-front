import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Aula } from '../models/aula';
import { Clase } from '../models/clase';
import { Curso } from '../models/curso';
import { Empleado } from '../models/empleado';
import { Estudiante } from '../models/estudiante';
import { Grado } from '../models/grado';
import { AulaService } from '../services/aula.service';
import { CursoService } from '../services/curso.service';
import { EmpleadoService } from '../services/empleado.service';
import { EstudianteService } from '../services/estudiante.service';
import { GradoService } from '../services/grado.service';
import { TokenService } from '../services/token.service';

import { MatriculaService } from '../services/matricula-service.service';
import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  URL_BACKEND: string = URL_BACKEND;

  profesorActivo: boolean;
  adminActivo: boolean;
  estudianteActivo: boolean;
  empleado: Empleado = new Empleado();
  clasesProfesor: Clase[] = [];
  clasesEstudiante: Clase[] = [];

  cantidadEstudiantes: number;
  cantidadProfesores: number;
  cantidadAulas: number;
  cantidadCursos: number;

  maxDate: Date;
  datePicked: Date;
  locale = 'es';
  bsConfig: Partial<BsDatepickerConfig>;


  eventsSubjectBar: Subject<any> = new Subject<any>();
  eventsSubjectPie: Subject<any> = new Subject<any>();
  cursos: Curso[] = [];
  grados: Grado[] = [];
  curso: Curso;
  gradoId: number;
  bimestre: string;

  //prueba
  multi: any[];
  multiData: any[] = [];


  //prueba
  single: any[];
  multiDataPie: any[] = [];
  fechaTransformPieChart: string;
 

  constructor(private route: ActivatedRoute,
              private estudianteService: EstudianteService,
              private router: Router,
              private tokenService: TokenService,
              private empleadoService: EmpleadoService,
              private aulaService: AulaService,
              private curoService: CursoService,
              private gradoService: GradoService,
              private localeService: BsLocaleService,
              private datePipe: DatePipe,
              private matriculaService: MatriculaService) { }

  ngOnInit(): void {
    

    this.tokenService.isProfesor() ? this.profesorActivo = true : this.profesorActivo = false;
    this.tokenService.isAdmin() ? this.adminActivo = true : this.adminActivo = false;
    this.tokenService.isEstudiante() ? this.estudianteActivo = true : this.estudianteActivo = false;

    // this.tokenService.setDashboardTrue();

    if(this.adminActivo){
      this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});

      this.empleadoService.getEmpleados()
          .subscribe((response: Empleado[]) => this.cantidadProfesores = response.length);
      this.estudianteService.getEstudiantes()
          .subscribe((response: Estudiante[]) => this.cantidadEstudiantes = response.length);
  
      this.aulaService.getAulas()
          .subscribe((response: Aula[]) => this.cantidadAulas = response.length);
  
      this.localeService.use(this.locale);
      this.maxDate = new Date();
      this.curoService.getCursos().subscribe(response => {
        this.cursos = response;
        this.cantidadCursos = this.cursos.length;
      });
      this.gradoService.getGrados().subscribe(response => this.grados = response);
  
    }


    if(this.profesorActivo){
      this.cargarClasesProfesor();
    }

    if(this.estudianteActivo){
      this.cargarClasesEstudiante();
    }

  }

  getNotasExcel(): void
  {

    if(this.curso == undefined){
      Swal.fire('','Elija una curso para generar el reporte.','info');
      return
    }
    
    let auxGradoId = 0;

    if(this.gradoId == undefined){

      this.matriculaService.getCursoReporte(this.curso.id.toString(), auxGradoId.toString(), this.bimestre)
      .subscribe(response => {

        if(response.length == 0) return Swal.fire('','No se encontraron registros de notas.','info');
        
        let link = document.createElement("a");
        link.href= `${URL_BACKEND}/api/matriculas/getReporteCursoXLS?idCurso=${this.curso.id}&idGrado=${auxGradoId}&bimestre=${this.bimestre}`;
        link.click();
        
        
      });
      return 
    }

    this.matriculaService.getCursoReporte(this.curso.id.toString(), this.gradoId.toString(), this.bimestre)
        .subscribe(response => {

          if(response.length == 0){
            Swal.fire('','No se encontraron registros de notas.','info');
            return
          }
          
          let link = document.createElement("a");
          link.href= `${URL_BACKEND}/api/matriculas/getReporteCursoXLS?idCurso=${this.curso.id}&idGrado=${this.gradoId}&bimestre=${this.bimestre}`;
          link.click();
        });
  }


  getAsistenciaExcel(): void
  {

    if(this.datePicked == undefined){
      Swal.fire('','Elija una fecha para generar el reporte.','info');
      return
    }

    this.fechaTransformPieChart = this.datePipe.transform(this.datePicked,'dd/MM/yyyy');
    
    if(this.fechaTransformPieChart[0] === '0'){
      let index = 0;
      this.fechaTransformPieChart = this.fechaTransformPieChart.substring(0, index) + this.fechaTransformPieChart.substring(index + 1);
    }


    this.matriculaService.getAsistenciasPorDia(this.fechaTransformPieChart)
        .subscribe(response => {
          if(response == null){
            Swal.fire('','No se encontraron registros de asistencias para esta fecha.','info');
            return
          }

          let link = document.createElement("a");
          link.href= `${URL_BACKEND}/api/matriculas/getXLS?fecha=${this.fechaTransformPieChart}`;
          
          link.click();
        })

  }

  

  irClase(clase: Clase): void {
    this.router.navigate([`/dashboard/aulas/${clase.aula.id}/clases/${clase.id}`]);
    // this.profesorActivo = false;
    // this.estudianteActivo = false;
    this.tokenService.setDashboardFalse();
  }

  cargarClasesProfesor(): void {
    this.empleadoService.getEmpleadoByDni(this.tokenService.getUsername())
    .subscribe(response => {
      this.empleado = response;
      this.empleadoService.getClasesEmpleado(this.empleado.id.toString())
          .subscribe(response => {
            this.clasesProfesor = response;
          });
    });
  }

  cargarClasesEstudiante(): void {
    this.estudianteService.getEstudianteByDni(this.tokenService.getUsername())
        .subscribe((response: any) => {
        this.aulaService.getClasesAula(response.estudiante.aulaEstudiante.id)
            .subscribe((response: Clase[]) => this.clasesEstudiante = response);
        });


  }

  loadDataBarchart(): void {
    if(this.curso === undefined){
      Swal.fire('Upps','Elija una curso para mostrar datos.','info');
      return
    }
    console.log(this.bimestre)
    if(this.bimestre === undefined){
      Swal.fire('Upps','Elija una bimestre para mostrar datos.','info');
      return
    }

    this.eventsSubjectBar.next([this.curso.id, this.gradoId, this.bimestre]);
  }

  loadDataPiechart(): void {
    if(this.datePicked == undefined){
      Swal.fire('Upps','Elija una fecha para mostrar datos.','info');
      return
    }

    let fechaTransformada: string = this.datePipe.transform(this.datePicked,'dd/MM/yyyy');
    if(fechaTransformada[0] === '0'){
      let index = 0;
      fechaTransformada = fechaTransformada.substring(0, index) + fechaTransformada.substring(index + 1);
    }
    this.eventsSubjectPie.next(fechaTransformada);
  }
  

  mostrarEstudiantes(){
    // this.router.navigate(['estudiantes/page/:page'], {relativeTo: this.route});
    
    this.tokenService.setDashboardFalse();
  }

  mostrarAulas(){
    
    this.tokenService.setDashboardFalse();
  }

  mostrarGrados(){
    this.tokenService.setDashboardFalse();
  }
  
  mostrarCursos(){
    this.tokenService.setDashboardFalse();
  }

  mostrarEmpleados(){
    this.tokenService.setDashboardFalse();
  }

  mostrarNotasEstudiante(){
    this.router.navigate(['estudiante/notas'], {relativeTo: this.route});
    this.tokenService.setDashboardFalse();
  }

  mostrarDashboard(){
    
   this.tokenService.setDashboardTrue();
   
   if(this.isProfesor){
     this.profesorActivo = true
     this.adminActivo = false;
     this.estudianteActivo = false;
   }else if(this.isAdmin){
    this.profesorActivo = false
    this.adminActivo = true;
    this.estudianteActivo = false;
   }else {
    this.profesorActivo = false
    this.adminActivo = false;
    this.estudianteActivo = true;
   }

  }

  get isDashboardActivo(): boolean {
    return this.tokenService.isDashboardActivo();
  }

  get isProfesor(): boolean {
    return this.tokenService.isProfesor();
  }

  get isEstudiante(): boolean {
    return this.tokenService.isEstudiante();
  }

  get isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }



 

  

}
