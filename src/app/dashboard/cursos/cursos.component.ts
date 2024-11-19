import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  errors: string[] = [];
  cursos: Curso[] = [];
  curso: Curso = new Curso();
  cursoActualizar: Curso = new Curso();

  constructor(private cursoService: CursoService) { }

  ngOnInit(): void {
    this.cursoService.getCursos().subscribe(response => {
      this.cursos = response;
    });
    
  }

  cargarCurso(curso: Curso): void {
    this.cursoService.getCurso(curso.id)
        .subscribe(response => this.cursoActualizar = response);
  }

  actualizarCurso(cursoForm: NgForm): void {
    this.cursoService.updateCurso(this.cursoActualizar)
        .subscribe(response => {
          this.cursoService.getCursos().subscribe(response => this.cursos = response);
          this.cerrarModal(cursoForm);

          Swal.fire(
            'Actualizado!',
            'El curso se actualizó con éxito.',
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
    cursoForm.controls['nombreCurso']?.setValue('');
    cursoForm.controls['nombreCursoActualizar']?.setValue('');
    this.cursoActualizar.id = undefined;
    this.errors = [];
  }

  crearCurso(cursoForm: NgForm): void {
    this.cursoService.saveCurso(this.curso)
        .subscribe( response => {
          this.cursos.push(this.curso);
          this.cursoService.getCursos().subscribe(response => this.cursos = response);
          cursoForm.controls['nombreCurso'].setValue('');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Curso creado con éxito',
            showConfirmButton: false,
            timer: 1000
          })
    }, err => {
      this.cerrarModal(cursoForm);
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
          `No se pudo crear el curso, inténtelo nuevamente.`,
          'error'
        )
      }

    })
  }

  eliminarCurso(curso: Curso): void {
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar el curso ${curso.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if(curso.clases.length > 0){
          Swal.fire(
            'Ups..!',
            'Curso relacionado con clases, no se puede eliminar.',
            'error'
          )
          return
        }
        this.cursoService.deleteCurso(curso)
            .subscribe(response => {
              this.cursos = this.cursos.filter(c => c != curso);
              Swal.fire(
                'Eliminado!',
                'El curso se eliminó con éxito.',
                'success'
              )
            })

      }
    })
  }

}
