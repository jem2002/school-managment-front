import { Component, Input, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { Estudiante } from 'src/app/models/estudiante';
import { Matricula } from 'src/app/models/matricula';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'detalle-estudiante',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() estudiante: Estudiante;

  @Input() empleado: Empleado;

  matriculas: Matricula[] = [];

  constructor(private modalService: ModalService, private matriclaService: MatriculaService) { }

  ngOnInit(): void {

  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.matriculas = [];
  }

  buscarMatriculas(): void {
    this.matriclaService.getMatriculasPorEstudiante(this.estudiante.id.toString())
    .subscribe(response => this.matriculas = response);
  }

  get modalActivo(): boolean {
    return this.modalService.modal;
  }
}
