import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EstudiantesComponent } from './dashboard/estudiantes/estudiantes.component';
import { HeaderComponent } from './shared/header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './dashboard/estudiantes/form/form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClasesComponent } from './dashboard/clases/clases.component';
import { AulasComponent } from './dashboard/aulas/aulas.component';
import { AulaFormComponent } from './dashboard/aulas/aula-form/aula-form.component';
import { GradosComponent } from './dashboard/grados/grados.component';
import { MatriculasComponent } from './dashboard/matriculas/matriculas.component';
import { MatriculaFormComponent } from './dashboard/matriculas/matricula-form/matricula-form.component';
import { CursosComponent } from './dashboard/cursos/cursos.component';
import { LineChartComponent } from './dashboard/charts/line-chart/line-chart.component';
import { PieChartComponent } from './dashboard/charts/pie-chart/pie-chart.component';
import { EmpleadosComponent } from './dashboard/empleados/empleados.component';
import { EmpleadoFormComponent } from './dashboard/empleados/empleado-form/empleado-form.component';
import { ClaseDetalleComponent } from './dashboard/clases/clase-detalle/clase-detalle.component';
import { LoginComponent } from './auth/login.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { AsistenciasComponent } from './dashboard/clases/asistencias/asistencias.component';
import { HorarioComponent } from './dashboard/horario/horario.component';
import { NotasComponent } from './dashboard/notas/notas.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');



import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ClaseFormComponent } from './dashboard/clases/clase-form/clase-form.component';
import { DetalleComponent } from './dashboard/estudiantes/detalle/detalle.component';
import { interceptorProvider } from './interceptors/estudiante-interceptor.service';
import { EstudianteGuardService as guard } from './guards/estudiante-guard.service';

import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerInterceptorService } from './interceptors/spinner-interceptor.service';
import { AsignacionesComponent } from './dashboard/clases/asignaciones/asignaciones.component';
import { EstudianteNotasComponent } from './dashboard/estudiantes/estudiante-notas/estudiante-notas.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'matriculas', component: MatriculasComponent , canActivate: [guard], data: {expectedRol: ['ADMIN']}},
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: 'estudiante/notas', component: EstudianteNotasComponent},
    { path: 'estudiantes/page/:page', component: EstudiantesComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'estudiantes/form', component: FormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'estudiantes/form/:id', component: FormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'aulas/:idAula/clases', component: ClasesComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'aulas/:idAula/clases/horario', component: HorarioComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'aulas/:idAula/clases/:idClase', component: ClaseDetalleComponent, canActivate: [guard], data: {expectedRol: ['ADMIN','PROFESOR','ESTUDIANTE']}},
    { path: 'aulas/:idAula/clases/:idClase/notas', component: NotasComponent, canActivate: [guard], data: {expectedRol: ['ADMIN','PROFESOR']}},
    { path: 'aulas/:idAula/clases/:idClase/asistencias', component: AsistenciasComponent, canActivate: [guard], data: {expectedRol: ['ADMIN','PROFESOR']}},
    { path: 'aulas/:idAula/clases/:idClase/asignaciones/:idAsignacion', component: AsignacionesComponent },
    { path: 'aulas/:idAula/asistencias', component: AsistenciasComponent, canActivate: [guard], data: {expectedRol: ['ADMIN','PROFESOR']}},
    { path: 'aulas', component: AulasComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'aulas/form', component: AulaFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'aulas/form/:id', component: AulaFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'aulas/form/:idAula/clases/:idClase', component: ClaseFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']}},
    { path: 'matriculas/form', component: MatriculaFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'grados', component: GradosComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'cursos', component: CursosComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'empleados', component: EmpleadosComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'empleados/form', component: EmpleadoFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} },
    { path: 'empleados/form/:id', component: EmpleadoFormComponent, canActivate: [guard], data: {expectedRol: ['ADMIN']} }
  ]},
  { path: '**', redirectTo:'', pathMatch:'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    EstudiantesComponent,
    HeaderComponent,
    FormComponent,
    DashboardComponent,
    ClasesComponent,
    AulasComponent,
    AulaFormComponent,
    GradosComponent,
    MatriculasComponent,
    MatriculaFormComponent,
    CursosComponent,
    LineChartComponent,
    PieChartComponent,
    EmpleadosComponent,
    EmpleadoFormComponent,
    ClaseDetalleComponent,
    LoginComponent,
    PaginatorComponent,
    AsistenciasComponent,
    HorarioComponent,
    NotasComponent,
    ClaseFormComponent,
    DetalleComponent,
    AsignacionesComponent,
    EstudianteNotasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgxSpinnerModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BsDatepickerModule.forRoot()
  ],
  providers: [DatePipe, interceptorProvider, {provide: LOCALE_ID, useValue: 'es'}, {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
