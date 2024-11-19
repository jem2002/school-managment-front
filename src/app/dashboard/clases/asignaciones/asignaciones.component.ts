import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { URL_BACKEND } from 'src/app/config/config';
import { Asignacion } from 'src/app/models/asignacion';
import { RespuestaAsignacion } from 'src/app/models/respuesta-asignacion';
import { AsignacionService } from 'src/app/services/asignacion.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {

  idClase: string = '';
  idAsignacion: string = '';
  idAula: string = '';
  asignacion: Asignacion = new Asignacion();
  respuestasAsignacion: RespuestaAsignacion[] = [];

  NOTA_APROBATORIA: number = 13;

  respuestaEncontrada: RespuestaAsignacion;

  URL_BACKEND: string = URL_BACKEND;
  archivoSeleccionado: any;

  horaInicio: string[] = ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00', '23:59'];
  horaFin: string[] = ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00', '23:59'];
  horaInicioSeleccionada: string;
  horaFinSeleccionada: string;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private activatedRoute: ActivatedRoute, private asignacionService: AsignacionService, private router: Router, private tokenService: TokenService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.bsConfig = Object.assign({dateInputFormat: 'YYYY-MM-DD'}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});
    this.cargarAsignaciones();
  }

  cargarAsignaciones() {

    

    this.activatedRoute.params
        .subscribe(params => {
          this.idClase = params['idClase'];
          this.idAsignacion = params['idAsignacion'];
          this.idAula = params['idAula'];

          this.asignacionService.getAsignacion(+this.idAsignacion)
              .subscribe((response: any) => {
                this.asignacion = response.asignacion;
                this.horaInicioSeleccionada = this.asignacion.fechaInicio.substring(11,16).toString();
                this.horaFinSeleccionada = this.asignacion.fechaFin.substring(11,16).toString();
                this.respuestaEstudianteEncontrada();

                if(!this.isEstudiante){
                  this.asignacionService.getRespuestasAsignacion(+this.idAsignacion)
                      .subscribe(response => this.respuestasAsignacion = response);
                }

              })

        });
  }

  eliminarAsignacion(idAsignacion: number) {

    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar la asignación.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.asignacionService.deleteAsignacion(idAsignacion)
          .subscribe(response => {
            Swal.fire(
              'Eliminado!',
              'La asignación ha sido eliminada con éxito.',
              'success'
            )
            this.router.navigate(['/dashboard/aulas/1/clases/'+this.idClase]);
        });
      }
    }); 
  }

  get isEstudiante(): boolean {
    return this.tokenService.isEstudiante();
  }

  respuestaEstudianteEncontrada() {
    this.asignacionService.findRespuestaEstudiante(this.tokenService.getUsername(), this.idAsignacion)
        .subscribe((response: RespuestaAsignacion) => {
          this.respuestaEncontrada = response;
        })
  }

  eliminarRespuesta(idRespuesta: number) {

    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar la respuesta.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.asignacionService.deleteRespuestaEstudiante(idRespuesta)
        .subscribe(response => {
          Swal.fire(
            'Eliminado!',
            'La respuesta ha sido eliminada con éxito.',
            'success'
          )
          this.respuestaEncontrada = undefined;
        });
      }
    }); 



  } 

  
  seleccionarArchivo(event){
    this.archivoSeleccionado = event.target.files[0];
  }

  crearRespuestaAsignacion() {

    if(this.archivoSeleccionado === undefined || this.archivoSeleccionado === null) {
      Swal.fire(`Info`, `Seleccione un archivo`, 'info');
      return 
    }

    this.asignacionService.saveRespuestaAsignacion(this.idAsignacion, this.archivoSeleccionado, this.tokenService.getUsername())
        .subscribe((response: any) => {
          Swal.fire(`Enviado`, `La respuesta se ha subido correctamente!`, 'success');
          this.respuestaEncontrada = response.respuestaAsignacion;
        });
  }

  actualizarRespuestas(nota: string, idRespuesta: number): void {
    this.asignacionService.updateRespuestaEstudiante(nota, idRespuesta)
        .subscribe(response => {
          Swal.fire(`Éxito`, `Nota registrada`, 'success');
        });
  }

  regresar() {
    this.router.navigate([`/dashboard/aulas/${this.idAula}/clases/${this.idClase}`]);
  }

  actualizarAsignacion(): void {
    this.asignacion.fechaInicio = this.datePipe.transform(this.asignacion.fechaInicio,'yyyy-MM-dd');
    this.asignacion.fechaFin = this.datePipe.transform(this.asignacion.fechaFin,'yyyy-MM-dd');
    this.asignacion.fechaInicio = this.asignacion.fechaInicio + ' ' + this.horaInicioSeleccionada + ':00';
    this.asignacion.fechaFin = this.asignacion.fechaFin + ' ' + this.horaFinSeleccionada + ':00';
    this.asignacionService.updateAsignacion(this.asignacion)
        .subscribe((response: any) => {
          Swal.fire(
            'Actualizado!',
            'La asignación fue actualizada con éxito!',
            'success'
          )
        });
  }



}
