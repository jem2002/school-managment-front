import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../../models/estudiante';
import { EstudianteService } from '../../services/estudiante.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {

  estudianteSeleccionado: Estudiante;

  listaEstudiantes: Estudiante[] = [];
  estudianteEncontrado: Estudiante;
  busquedaActivada: boolean = false;
  buscarPorDni: string;

  paginador: any;

  constructor(private estudianteService: EstudianteService, private activatedRoute: ActivatedRoute, private modalService: ModalService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap
    .subscribe(params => {

      let page: number = +params.get('page');

      if(!page) {page = 0}

      this.estudianteService.getEstudiantesPage(page)
          .subscribe(response => {
            this.listaEstudiantes = response.content as Estudiante[];
            this.paginador = response;
          }) ;
    });

  }

  limpiarBusqueda(): void {
    this.estudianteEncontrado = null;
    this.busquedaActivada = false;
  }
  
  buscarEstudiante(): void {

    if(this.buscarPorDni == undefined){
      return
    }

    this.estudianteService.getEstudianteByDni(this.buscarPorDni)
        .subscribe((response: any) => {

          if(response.estudiante === null){
            Swal.fire('No encontrado',response.mensaje,'info');
            this.busquedaActivada = false;
            return 
          }
          this.busquedaActivada = true;
          this.estudianteEncontrado = response.estudiante;
        });
  }

  eliminar(estudiante: Estudiante){

    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar al estudiante ${estudiante.nombres}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(estudiante.aulaEstudiante === null){
          this.estudianteService.deleteEstudiante(estudiante.id)
          .subscribe(response => {
            this.listaEstudiantes = this.listaEstudiantes.filter(e => e !== estudiante);
          });
                Swal.fire(
                  'Eliminado!',
                  'El Estudiante se eliminó con éxito.',
                  'success'
                )
        }else{

          Swal.fire(
            
            'Ups..!',
            'Estudiante que pertenece a un aula, no se puede eliminar.',
            'error'
          )
          return
        }

      }
    })
  }

  abrirModal(estudiante: Estudiante) {
    this.estudianteSeleccionado = estudiante;
    this.modalService.abrirModal();
  }

}
