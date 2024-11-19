import { Grado } from "./grado";
import { Nivel } from "./nivel";
import { Turno } from "./turno";

export class Aula {
    id: number;
    nombre: string;
    seccion: string;
    nivel: Nivel;
    turno: Turno;
    gradoAula: Grado;
    capacidad: number;
    cantidadEstudiante: number;
}
