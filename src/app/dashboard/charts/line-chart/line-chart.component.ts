import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Aula } from 'src/app/models/aula';
import { Clase } from 'src/app/models/clase';
import { AulaService } from 'src/app/services/aula.service';
import { MatriculaService } from 'src/app/services/matricula-service.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() events: Observable<any>;

  aulas: Aula[] = [];
  multi: any[];
  view: any[] = [700, 400];

  multiData: any[] = [];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Aulas';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Cantidad de aprobados';
  animations: boolean = true;

  colorScheme = {
    domain: ['#2cd280', '#66b0ff']
  };

  constructor(private aulaService: AulaService, private matriculaService: MatriculaService) {
  }


  ngOnInit(): void {
    this.events.subscribe(ids => {
      if(ids[1] == undefined){
        ids[1] = 0;
      }
      this.getDatosChart(ids[0], ids[1], ids[2]);
    })
  }

  getDatosChart(idCurso: number, idGrado: number, bimestre: string): void {
    this.multiData = [];
    this.multi = [];

    this.matriculaService.getCursoReporte(idCurso.toString(), idGrado.toString(), bimestre)
        .subscribe(response => {
          console.log(response)
          if(response == null){
            return
          }

          response.forEach(r => {
            this.multiData.push({
              "name": r.nombreAula,
              "series":[
                {
                  "name": "Aprobados",
                  "value": r.aprobados
                },
                {
                  "name": "Desaprobados",
                  "value": r.desaprobados
                }
              ]
            });
          })


          this.multi = [...this.multiData].sort(this.compare);
        })

  }

  compare( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }
  

}
