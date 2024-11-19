import { DatePipe } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatriculaService } from 'src/app/services/matricula-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() events: Observable<any>;
  multiData: any[] = [];

  single: any[];
  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#2cd280', '#dc3545', '#ffc107']
  };

  constructor(private matriculaService: MatriculaService, private datePipe: DatePipe) { }
  
  ngOnInit(): void {
    

    this.events.subscribe((fecha: string) => {
      this.multiData = [];
      this.single = [];

      this.matriculaService.getAsistenciasPorDia(fecha)
          .subscribe(response => {

            if(response == null){
              this.multiData = [];
              this.single = [];
              return
            }

            this.multiData.push(    {
              "name": "PUNTUAL",
              "value": response.puntual
            },
            {
              "name": "INASISTENCIA",
              "value": response.inasistencia
            },
            {
            "name": "TARDANZA",
              "value": response.tardanza
            });
            this.single = [...this.multiData]
          
          })

    })
    
  }


}
