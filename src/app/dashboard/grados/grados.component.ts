import { APP_BOOTSTRAP_LISTENER, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Grado } from 'src/app/models/grado';
import { GradoService } from 'src/app/services/grado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grados',
  templateUrl: './grados.component.html',
  styleUrls: ['./grados.component.css']
})
export class GradosComponent implements OnInit {
  errors: string[] = [];
  grados: Grado[] = [];
  grado: Grado = new Grado();
  gradoActualizar: Grado = new Grado();
  

  constructor(private gradoService: GradoService) { }

  ngOnInit(): void {
    this.gradoService.getGrados().subscribe(response => this.grados = response);
  }

  crearGrado(cursoForm: NgForm): void {
    this.gradoService.saveGrado(this.grado)
        .subscribe(response => {
          this.grados.push(this.grado);
          this.gradoService.getGrados().subscribe(response => this.grados = response);
          
          cursoForm.controls['nombreGrado'].setValue('');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Curso creado con éxito',
            showConfirmButton: false,
            timer: 1000
          });
        }, err => {
          this.errors = err.error.errors;
          let errorSweet = '';
          this.errors.forEach(e => errorSweet = e)
          if(err.status == 400){
            Swal.fire(
              'Error al crear!',
              `${errorSweet}`,
              'error'
            )
          }

          if(err.status == 500){
            Swal.fire(
              'Error al crear!',
              `No se pudo crear el grado, inténtelo nuevamente.`,
              'error'
            )
          }

        });
  }

  cargarGrado(grado: Grado): void {
    this.gradoService.getGrado(grado.id)
        .subscribe(response => this.gradoActualizar = response);
  }

  actualizarGrado(cursoForm: NgForm): void {
    this.gradoService.updateGrado(this.gradoActualizar)
        .subscribe(response => {
          this.gradoService.getGrados().subscribe(response => this.grados = response);
          this.cerrarModal(cursoForm);

          Swal.fire(
            'Actualizado!',
            'El grado se actualizó con éxito.',
            'success'
          )
        }, err => {
          this.cerrarModal(cursoForm);
          this.errors = err.error.errors;
          let errorSweet = '';
          this.errors.forEach(e => errorSweet = e)
          if(err.status == 400){
            Swal.fire(
              'Error al actualizar!',
              `${errorSweet}`,
              'error'
            )
          }

          if(err.status == 500){
            Swal.fire(
              'Error al actualizar!',
              `No se pudo actualizar, inténtelo nuevamente.`,
              'error'
            )
          }

        });
  }

  cerrarModal(cursoForm: NgForm): void {
    //limpiamos los campos 
    cursoForm.controls['nombreGrado']?.setValue('');
    cursoForm.controls['nombreGradoActualizar']?.setValue('');
    this.gradoActualizar.id = undefined;
    this.errors = [];
  }


  eliminarGrado(grado: Grado): void {
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar el grado ${grado.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.gradoService.deleteGrado(grado)
            .subscribe(response => {
              this.grados = this.grados.filter(c => c != grado);
              Swal.fire(
                'Eliminado!',
                'El grado se eliminó con éxito.',
                'success'
              )
            }, err => {
              if(err.status == 500){
                Swal.fire(
                  'Ups..!',
                  'Grado relacionado con aula o estudiante, no se puede eliminar.',
                  'error'
                )
              }
            })

      }
    })
  }

}
