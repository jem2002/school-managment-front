import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NuevoUsuario } from 'src/app/auth/models/nuevo-usuario';
import { Apoderado } from 'src/app/models/apoderado';
import { Estudiante } from 'src/app/models/estudiante';
import { Grado } from 'src/app/models/grado';
import { Matricula } from 'src/app/models/matricula';
import { Nivel } from 'src/app/models/nivel';
import { Turno } from 'src/app/models/turno';
import { ApoderadoService } from 'src/app/services/apoderado.service';
import { AuthService } from 'src/app/services/auth.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { GradoService } from 'src/app/services/grado.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula-form',
  templateUrl: './matricula-form.component.html',
  styles: [
  ]
})
export class MatriculaFormComponent implements OnInit {

  estudiante: Estudiante = new Estudiante();
  apoderado: Apoderado = new Apoderado();
  matricula: Matricula = new Matricula();
  sexo: string[] = ['MASCULINO', 'FEMENINO'];
  grados: Grado[] = [];
  niveles: Nivel[] = [];
  turnos: Turno[] = [];


  maxDate: Date;
  locale = 'es';
  bsConfig: Partial<BsDatepickerConfig>;

  buscarDNI: string;

  constructor(private matriculaService: MatriculaService,
              private router: Router,
              private gradoService: GradoService,
              private datePipe: DatePipe,
              private estudianteService: EstudianteService,
              private apoderadoService: ApoderadoService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.bsConfig = Object.assign({dateInputFormat: 'YYYY/MM/DD'}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});
    this.estudiante.apoderado = this.apoderado;
    this.matricula.estudiante = this.estudiante;
    this.gradoService.getGrados().subscribe(response => this.grados = response);
    this.matriculaService.getNiveles().subscribe(response => this.niveles = response);
    this.matriculaService.getTurnos().subscribe(response => this.turnos = response);
  }

  buscarApoderado(): void {

    if(this.apoderado.dni == undefined){
      return
    }


    this.apoderadoService.getApoderadoByDni(this.estudiante.apoderado.dni)
        .subscribe((response: any) => {

          if(response.apoderado === null){
            Swal.fire('No encontrado',response.mensaje,'info');
            return 
          }
          this.estudiante.apoderado = response.apoderado;
        });
  }


  crear(): void {

    this.estudianteService.getEstudianteByDni(this.estudiante.dni)
        .subscribe((response: any) => {
            if(response.estudiante !== null){
              Swal.fire('Estudiante existente',`El estudiante con el dni ${this.estudiante.dni} ya existe.`,'info');
            return 
            }

            let nuevoUsuario: NuevoUsuario = new NuevoUsuario();
            nuevoUsuario.username = this.estudiante.dni;
            nuevoUsuario.password = this.estudiante.dni;
            nuevoUsuario.roles.push('ROLE_ESTUDIANTE')
        
            this.authService.nuevo(nuevoUsuario)
                .subscribe(response => {
                  this.estudiante.usuario = response.usuario;
                  this.estudiante.fechaNacimiento = this.datePipe.transform(this.estudiante.fechaNacimiento,'yyyy-MM-dd');
                  this.matriculaService.saveMatricula(this.matricula).subscribe(response =>{
                    this.router.navigate(['/dashboard/estudiantes/page/0'])
                    Swal.fire(
                      'Matrícula creada',
                      'La matrícula se ha creado con éxito',
                      'success'
                    )
                  });
                });



        })





  }

}
