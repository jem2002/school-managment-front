import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { URL_BACKEND } from 'src/app/config/config';
import { Asignacion } from 'src/app/models/asignacion';
import { Clase } from 'src/app/models/clase';
import { Estudiante } from 'src/app/models/estudiante';
import { Material } from 'src/app/models/material';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { AulaService } from 'src/app/services/aula.service';
import { ClaseService } from 'src/app/services/clase.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clase-detalle',
  templateUrl: './clase-detalle.component.html',
  styleUrls: ['./clase-detalle.component.css']
})
export class ClaseDetalleComponent implements OnInit {

  URL_BACKEND: string = URL_BACKEND

  clase: Clase = new Clase();
  listaEstudiantes: Estudiante[] = [];

  idAula: string = '';
  idClase: string = '';
  nombreFile: string = '';

  estudianteActivo: boolean = false;

  asignacionesPorClase: Asignacion[] = [];
  asignacion: Asignacion = new Asignacion();

  horaInicio: string[] = ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00', '23:59'];
  horaFin: string[] = ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00', '23:59'];
  horaInicioSeleccionada: string;
  horaFinSeleccionada: string;

  private archivoPDFSeleccionada: File;

  bsConfig: Partial<BsDatepickerConfig>;


  constructor(private activatedRoute: ActivatedRoute,
              private claseService: ClaseService,
              private aulaService: AulaService,
              private asignacionService: AsignacionService,
              private router: Router,
              private datePipe: DatePipe,
              private tokenService: TokenService) { }

  ngOnInit(): void {

    this.bsConfig = Object.assign({dateInputFormat: 'YYYY-MM-DD'}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});

    this.cargarClase();

    if(this.isEstudiante){
      this.estudianteActivo = true;
    }
  }

  regresar(): void {
    if(this.isProfesor){
      this.tokenService.setDashboardTrue();
      this.router.navigate([`dashboard`]);
    }else if(this.isEstudiante){
      this.tokenService.setDashboardTrue();
      this.router.navigate([`dashboard`]);
    } else {
      this.router.navigate([`dashboard/aulas/${this.idAula}/clases`]);
    }
    
  }

  get isProfesor(): boolean{
    return this.tokenService.isProfesor();
  }

  get isEstudiante(): boolean {
    return this.tokenService.isEstudiante();
  }

  cargarClase(): void {
    this.activatedRoute.params
        .subscribe(params => {
          this.idClase = params['idClase'];
          this.idAula = params['idAula'];
          let idClase1 = +this.idClase;
          this.claseService.getClase(idClase1)
              .subscribe(response => {
                this.clase = response
                this.aulaService.getEstudiantesAula(this.idAula).subscribe(response => this.listaEstudiantes = response);
                this.cargarAsignaciones(idClase1);
              });
        })
  }

  seleccionarArchivoPDF(event){
    this.archivoPDFSeleccionada = event.target.files[0];
  }

  subirArchivoPDF(): void {

    if(this.archivoPDFSeleccionada === undefined || this.archivoPDFSeleccionada === null || this.nombreFile.length === 0) return

    this.claseService.subirArchivo(this.archivoPDFSeleccionada, this.idClase, this.nombreFile)
        .subscribe( response => {
          this.clase = response;
          Swal.fire(`El archivo se ha subido correctamente!`, `El archivo ${this.nombreFile} se guardó con éxito`, 'success');
        })
  }

  eliminarArchivo(material: Material): void {


    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar el archivo ${material.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.claseService.eliminarArchivoPDF(this.idClase, material.id.toString())
        .subscribe(response => {
          this.clase.materiales = this.clase.materiales.filter(m => m.id !=  material.id);
          Swal.fire(
            'Eliminado!',
            'El material ha sido eliminado con éxito.',
            'success'
          )
        });
        }
  }
  )};

  cargarAsignaciones(idClase: number) {
    this.claseService.listaAsignacionesPorClase(idClase)
        .subscribe(response => {
          this.asignacionesPorClase = response;
        });
  }

  crearAsignacion(): void {
    this.asignacion.fechaInicio = this.datePipe.transform(this.asignacion.fechaInicio,'yyyy-MM-dd');
    this.asignacion.fechaFin = this.datePipe.transform(this.asignacion.fechaFin,'yyyy-MM-dd');
    this.asignacion.fechaInicio = this.asignacion.fechaInicio + ' ' + this.horaInicioSeleccionada + ':00';
    this.asignacion.fechaFin = this.asignacion.fechaFin + ' ' + this.horaFinSeleccionada + ':00';
    this.asignacionService.saveAsignacion(this.asignacion, +this.idClase)
        .subscribe((response: any) => {
          this.asignacionesPorClase.push(response.asignacion);
          Swal.fire(
            'Creado!',
            'La asignación fue creada con éxito!',
            'success'
          )
        });
  }

}
