import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NuevoUsuario } from 'src/app/auth/models/nuevo-usuario';
import { Empleado } from 'src/app/models/empleado';
import { Especialidad } from 'src/app/models/especialidad';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
})
export class EmpleadoFormComponent implements OnInit {

  empleado: Empleado = new Empleado();
  especialidad: Especialidad = new Especialidad();

  especialidadValida: boolean = true;

  errores: string[] = [];
  sexo: string[] = ['MASCULINO', 'FEMENINO'];
  especialidades: Especialidad[] = [];
  especialidadesDocente: Especialidad[] = [];
  especialidadesAuxiliar: Especialidad[] = [];

  maxDate: Date;
  locale = 'es';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private empleadoService: EmpleadoService, 
              private router: Router,
              private datePipe: DatePipe, 
              private activatedRoute: ActivatedRoute, 
              private authService: AuthService) { }

  ngOnInit(): void {
    
    this.maxDate = new Date();
    this.bsConfig = Object.assign({dateInputFormat: 'YYYY/MM/DD'}, { containerClass: 'theme-dark-blue' },{ isAnimated: true});
    this.cargarEmpleado();
  }

  cargarEmpleado(){
    this.activatedRoute.params
        .subscribe(params => {
          let id:number = +params['id'];

          
          this.empleadoService.getEspecialidades()
          .subscribe(response => this.especialidades = response);

          if(id){
            this.empleadoService.getEmpleado(id)
                .subscribe(response => {
                  this.empleado = response;
                  this.especialidadesDocente = this.empleado.especialidades;
                  this.empleado.especialidades.forEach(e => {
                    this.especialidades.forEach(es => {
                      if(e.id == es.id){
                        es.asignado = true;
                        return
                      }
                    })
                  })
                });
          }

        })
        
  }

  crear(){
    let nuevoUsuario: NuevoUsuario = new NuevoUsuario();
    nuevoUsuario.username = this.empleado.dni;
    nuevoUsuario.password = this.empleado.dni;
    nuevoUsuario.roles.push('ROLE_PROFESOR')
    this.empleado.especialidades = this.especialidadesDocente;
    this.authService.nuevo(nuevoUsuario).subscribe(response => {
      this.empleado.fechaNacimiento = this.datePipe.transform(this.empleado.fechaNacimiento, 'yyyy-MM-dd');
      this.empleado.usuario = response.usuario;
      this.empleadoService.saveEmpleado(this.empleado)
      .subscribe(response => {
        
        this.router.navigate(['/dashboard/empleados']);
        Swal.fire(
          'Empleado creado ',
          'El empleado se ha creado con éxito',
          'success'
        )
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log(this.errores)
      }
      );
    });

  }

  actualizar(){

    this.empleado.fechaNacimiento = this.datePipe.transform(this.empleado.fechaNacimiento, 'yyyy-MM-dd');
    this.empleado.especialidades = this.especialidadesDocente;

    this.empleadoService.updateEmpleado(this.empleado)
        .subscribe(response => {
          this.router.navigate(['/dashboard/empleados']);
          Swal.fire(
            'Empleado actualizado',
            'El empleado se ha actualizado con éxito',
            'success'
          )
        },
        err => {
          this.errores = err.error.errors as string[];
          console.log(this.errores)
        }
        );
  }

  crearEspecialidad(): void {
    console.log(this.especialidad)
    if(this.especialidad.nombre == undefined || this.especialidad.nombre.length < 6){
      this.especialidadValida = false;
      return
    }

    this.empleadoService.saveEspecialidad(this.especialidad)
        .subscribe(response => {
          this.especialidades.push(response.especialidad);
        });
    
  }

  asignarEspecialidad(especialidad: Especialidad): void {

    if(this.especialidadesDocente.length > 0){
      let encontrado = false;
      this.especialidadesDocente.forEach(e => {
        if(e.id == especialidad.id){
          this.especialidadesDocente = this.especialidadesDocente.filter(e => e.id != especialidad.id);
          encontrado = true;
          return
        }
      })
      if(!encontrado){
        this.especialidadesDocente.push(especialidad);
      }
    }else{
      this.especialidadesDocente.push(especialidad);
    }
  }

}
