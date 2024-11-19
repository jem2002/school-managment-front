import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent implements OnInit {
  listaEmpleados: Empleado[] = [];

  empleadoSeleccionado: Empleado;

  constructor(private empleadoService: EmpleadoService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.empleadoService.getEmpleados().subscribe((response) => {
      this.listaEmpleados = response;
    });
  }

  abrirModal(empleado: Empleado) {
    this.empleadoSeleccionado = empleado;
    this.modalService.abrirModal();
  }

  eliminar(empleado: Empleado) {
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `Está apunto de eliminar al docente ${empleado.nombres}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#164e85',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let clasesEmpleado: number = 0;
        this.empleadoService
          .getClasesEmpleado(empleado.id.toString())
          .subscribe((response) => {
            clasesEmpleado = response.length;
            if (clasesEmpleado > 0) {
              Swal.fire(
                'Ups..!',
                'Empleado con clases asignadas, no se puede eliminar.',
                'error'
              );
              return;
            }

            this.empleadoService
              .deleteEmpleado(empleado.id)
              .subscribe((response) => {
                this.listaEmpleados = this.listaEmpleados.filter(
                  (e) => e !== empleado
                );
              });
            Swal.fire(
              'Eliminado!',
              'El empleado se eliminó con éxito.',
              'success'
            );
          });
      }
    });
  }
}
