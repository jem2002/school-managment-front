import { Usuario } from "../auth/models/usuario";
import { Apoderado } from "./apoderado";
import { Asistencia } from "./asistencia";
import { Aula } from "./aula";
import { Grado } from "./grado";
import { Nivel } from "./nivel";
import { Nota } from "./nota";
import { Turno } from "./turno";

export class Estudiante {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    dni: string;
    domicilio: string;
    celular: string;
    sexo: string;
    correo: string;
    usuario: Usuario;
    apoderado: Apoderado;
    aulaEstudiante: Aula;
    grado: Grado;
    turno: Turno;
    nivel: Nivel;
    asistencias: Asistencia[];
    notas: Nota[];
}
