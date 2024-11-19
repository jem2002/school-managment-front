import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from 'src/app/models/estudiante';
import { Nota } from 'src/app/models/nota';
import { AulaService } from 'src/app/services/aula.service';
import { ClaseService } from 'src/app/services/clase.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {

  estudiantes: Estudiante[] = [];
  notas: Nota[] = [];
  NOTA_APROBATORIA: number = 3.0;
  
  idAula: string;
  idClase: string;

  form = this.fb.group({
    notasForm: this.fb.array([])
  });

  constructor(private activatedRoute: ActivatedRoute,
              private claseService: ClaseService,
              private aulaService: AulaService,
              private router: Router,
              private tokenService: TokenService,
              private matriculaService: MatriculaService,
              private fb: FormBuilder) { }

  ngOnInit(): void {


    this.activatedRoute.params
        .subscribe(params => {
          this.idAula = params['idAula'];
          this.idClase = params['idClase'];

          if(this.idAula && this.idClase){

            this.claseService.getClase(+this.idClase)
                .subscribe(clase => {
                  this.aulaService.getEstudiantesAula(this.idAula)
                      .subscribe(response => {
                        let notasAux: Nota[] = [];
                        this.estudiantes = response;

                        this.estudiantes.forEach(e => {
                          if(e.notas.length == 0 || e.notas.find(n => n.curso.id == clase.curso.id) == undefined){
                            let nota: Nota = new Nota();
                            nota.curso = clase.curso;
                            nota.nota_bim1 = 0;
                            nota.nota_bim2 = 0;
                            nota.nota_bim3 = 0;
                            nota.nota_bim4 = 0;
                            nota.estudiante = e;
                            notasAux.push(nota);
                          }

                        })

                        if(notasAux.length > 0){
                          this.matriculaService.actualizarNotas(notasAux)
                          .subscribe(response => {
                            this.matriculaService.getNotas(clase.curso.id.toString(), this.idAula)
                            .subscribe(response => {
                              this.notas = response;
                              this.notas.forEach( nota => {
                                this.addNota(nota);
                              });
                            })
                          })
                        }else{
                          this.matriculaService.getNotas(clase.curso.id.toString(), this.idAula)
                          .subscribe(response => {
                            this.notas = response;
                            this.notas.forEach( nota => {
                              this.addNota(nota);
                            });
                          })  
                        }

                      });
  
                })


          }
        })

  }

  get notasForm() {
    return this.form.controls["notasForm"] as FormArray;
  }

  enviar(values:any){
    this.notas = [];
    let notaMayorA25: boolean = false;
    values.notasForm.forEach( nota => {
      if(nota.bimestre1 > 25 || nota.bimestre2 > 25 || nota.bimestre3 > 25 || nota.bimestre4 > 25) {
        
        notaMayorA25 = true;
      }

      let notaActualizar: Nota = new Nota();
      notaActualizar.id = nota.idNota;
      notaActualizar.nota_bim1 = nota.bimestre1;
      notaActualizar.nota_bim2 = nota.bimestre2;
      notaActualizar.nota_bim3 = nota.bimestre3;
      notaActualizar.nota_bim4 = nota.bimestre4;  
      notaActualizar.estudiante = nota.estudiante;
      notaActualizar.curso = nota.curso;
      this.notas.push(notaActualizar);
      
    })

    if(notaMayorA25) {
      Swal.fire('Verificar', 'La nota no puede ser mayor a 25','info');
      return 
    }
    
    this.matriculaService.actualizarNotas(this.notas)
        .subscribe(response => {
          Swal.fire('Notas guardadas', 'Las notas se guardaron con éxito.','success');
          this.router.navigate([`dashboard/aulas/${this.idAula}/clases/${this.idClase}`]);
        })
  }

  regresar(): void {
    this.router.navigate([`dashboard/aulas/${this.idAula}/clases/${this.idClase}`]);
  }

  get isProfesor(): boolean{
    return this.tokenService.isProfesor();
  }

  addNota(nota: Nota){

      const notaForm = this.fb.group({

        idNota: [nota.id],
        bimestre1: [this.validarNumero(nota.nota_bim1), Validators.maxLength(2)],
        bimestre2: [this.validarNumero(nota.nota_bim2), Validators.maxLength(2)],
        bimestre3: [this.validarNumero(nota.nota_bim3), Validators.maxLength(2)],
        bimestre4: [this.validarNumero(nota.nota_bim4), Validators.maxLength(2)],
        promedioFinal: [{value: this.validarNumero(nota.promedio_final), disabled: true}],
        estudiante: [nota.estudiante],
        curso: [nota.curso],
        nombreEstudiante: [{value:nota.estudiante.nombres+' '+nota.estudiante.apellidoPaterno, disabled: true}]
      });

    this.notasForm.push(notaForm);
  }

  validarNumero(number: number): string{

    let numberToString: string = number.toString();

    if(numberToString.length === 1) numberToString = '0' + numberToString;

    return numberToString;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

 
}
