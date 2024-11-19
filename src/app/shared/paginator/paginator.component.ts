import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges  {

  @Input() paginador: any;

  paginas: number[];

  desde: number;
  hasta: number;
  url: string = '';

  parametro: string;

  constructor(private router:Router) { }

  ngOnInit(): void {

    this.url = this.router.url;
    if(this.url.includes("estudiantes")){
      this.parametro = '/dashboard/estudiantes'
    }
  }

  ngOnChanges() {
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    if(this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0)
                                                       .map((_valor, indice) => indice + this.desde);

    } else {
      this.paginas = new Array(this.paginador.totalPages).fill(0)
                                                       .map((_valor, indice) => indice + 1);

    }
  }

}
