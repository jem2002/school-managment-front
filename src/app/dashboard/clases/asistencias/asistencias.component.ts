import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Asistencia } from 'src/app/models/asistencia';
import { Estudiante } from 'src/app/models/estudiante';
import { AulaService } from 'src/app/services/aula.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.css']
})
export class AsistenciasComponent implements OnInit {

  fecha: Date = new Date();
  fechaActual: string = '';

  fechaTransformada: string;
  

  idAula: string;
  idClase: string;

  asistenciaPrueba: Asistencia[] = [];
  estudiantes: Estudiante[] = [];
  estudiantesAux: Estudiante[] = [];
  asistencias: Asistencia[] = [];
  nuevasAsistenciasPorBusqueda: Asistencia[] = [];

  busquedaActivada: boolean = false;

  maxDate: Date;
  datePicked: Date;
  locale = 'es';
  bsConfig: Partial<BsDatepickerConfig>;

  fechaElegida: string;

  constructor(private aulaService: AulaService, 
              private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe, 
              private estudianteService: EstudianteService,
              private matriculaService: MatriculaService,
              private router: Router) { }

  ngOnInit(): void {
    
    this.maxDate = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});
    this.cargarDatos();
  }

  cargarDatos(){
    this.activatedRoute.params.subscribe( params => {
      let idAula: string = params['idAula'];
      this.idClase = params['idClase'];
      this.idAula = params['idAula'];

      
      this.fechaActual = this.datePipe.transform(this.fecha, 'dd/MM/yyyy');

      if(this.fechaActual[0] === '0'){
        let index = 0;
        this.fechaActual = this.fechaActual.substring(0, index) + this.fechaActual.substring(index + 1);
      }

      this.aulaService.getEstudiantesAula(idAula).subscribe(response => {
        this.estudiantes = response;
        this.estudiantes.forEach(e => {

          //Si no existe asistencia se instancia una nueva para poder guardarla en la BBDD.
          if(e.asistencias.length === 0){
            let asitencia: Asistencia = new Asistencia();
            e.asistencias.push(asitencia);
          }



          //Se obtiene la última asistencia
          // let ultimaAsistencia: Asistencia = e.asistencias[e.asistencias.length-1];
          let asistenciaHoy: Asistencia = e.asistencias.find(e => e.fecha == this.fechaActual);
          

          if(asistenciaHoy == undefined) {
            let asistenciaNueva: Asistencia = new Asistencia();
            e.asistencias.push(asistenciaNueva);
                        
            //volvemos a asignar la última asistencia
            asistenciaHoy = e.asistencias[e.asistencias.length-1];
          }
          
          
          //agregamos un atributo temporal para poder verificar los estados en los checkboxes con la última asistencia 
          e['asistenciaHoy'] = asistenciaHoy.estado;
        })
        
      });
    })
  }

  cargarAsistencia(): void {

    if(this.estudiantes.length == 0){
      this.estudiantes = this.estudiantesAux;
      //cargamos estudiantes y borramos última asistencia si no existe ID
      this.estudiantes.forEach(e => {
        if(e.asistencias[e.asistencias.length-1].id === undefined){
          e.asistencias.pop();
        }
      })
    }

      this.estudianteService.actualizarAsistencia(this.estudiantes)
        .subscribe(response => {

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se registró la asistencia!',
            showConfirmButton: false,
            timer: 1000
          })
          
          if(this.idClase === undefined){
            this.router.navigate([`dashboard/aulas/${this.idAula}/clases`]);
          }else{
            this.router.navigate([`dashboard/aulas/${this.idAula}/clases/${this.idClase}`]);
          }
        });
  

  }

  asistencia(estudiante: Estudiante, estado: string){

    if(this.fechaTransformada != null || this.fechaTransformada != undefined){
      let asistenciaEncontrada: Asistencia = estudiante.asistencias.find(a => a.fecha == this.fechaTransformada);
      let asistenciaIndex: number = estudiante.asistencias.indexOf(asistenciaEncontrada);
      if(asistenciaEncontrada == undefined) return 
      asistenciaEncontrada.estado = estado;
      estudiante.asistencias[asistenciaIndex] = asistenciaEncontrada;
      
      return
    }else {
      
        let asistenciaEncontrada: Asistencia = estudiante.asistencias.find(a => a.fecha == this.fechaActual);
        let asistenciaIndex: number = estudiante.asistencias.indexOf(asistenciaEncontrada);
  
        asistenciaEncontrada.estado = estado;
        estudiante.asistencias[asistenciaIndex] = asistenciaEncontrada;
        return
      
    }

  }

  buscarAsistencias(): void {

    if(this.datePicked == null){
      Swal.fire('Ups!','Ingrese una fecha válida.', 'info');
      return
    }

    this.fechaTransformada = this.datePipe.transform(this.datePicked,'dd/MM/yyyy');

    if(this.fechaTransformada[0] === '0'){
      let index = 0;
      this.fechaTransformada = this.fechaTransformada.substring(0, index) + this.fechaTransformada.substring(index + 1);
    }

    if(this.fechaTransformada == null){
      Swal.fire('Ups!','Ingrese una fecha válida.', 'info');
      return
    }



    if(this.estudiantes.length > 0){
      this.estudiantesAux = this.estudiantes;
    }
    
    this.estudiantes = [];

    this.matriculaService.getAsistenciasFechaAula(this.fechaTransformada, this.idAula)
        .subscribe((response: Asistencia[]) => {
          this.asistencias = response; 
          this.busquedaActivada = true;

          if(response.length == 0){
            this.estudiantes = this.estudiantesAux;
            this.busquedaActivada = false;
            this.estudiantes.forEach(e =>  {
              let ultimaAsistencia: Asistencia = e.asistencias[e.asistencias.length-1];
              if(ultimaAsistencia.id){
                  
                let asistenciaNuevaPorBusqueda: Asistencia = new Asistencia();
                asistenciaNuevaPorBusqueda.fecha = this.fechaTransformada;

                //agregamos un atributo temporal para poder verificar los estados en los checkboxes con la última asistencia 
                e['asistenciaHoy'] = asistenciaNuevaPorBusqueda.estado;
                
                e.asistencias.push(asistenciaNuevaPorBusqueda)
                
              }else{
                ultimaAsistencia.fecha = this.fechaTransformada;
                e['asistenciaHoy'] = 'FALTA';
              }
        })
      }
    })

  }

  asistenciaPorBusqueda(asistencia: Asistencia, estado: string){
    asistencia.estado = estado;

    let estudiante: Estudiante = this.estudiantesAux.find(e => e.id == asistencia.estudiante.id);
    let indexEstudiante: number = this.estudiantesAux.indexOf(estudiante);
    estudiante.asistencias.forEach(a => {
      if(a.id == asistencia.id){
        a.estado = estado;
        a.estudiante = null;
        
        return a;
      } 
    })

    this.estudiantesAux[indexEstudiante] = estudiante;
  }


  

}
