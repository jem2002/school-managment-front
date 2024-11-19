import { Curso } from "./curso";
import { Estudiante } from "./estudiante";

export class Nota {
    id: number;
    nota_bim1: number;
    nota_bim2: number;
    nota_bim3: number;
    nota_bim4: number;
    promedio_final: number;
    curso: Curso;
    estudiante: Estudiante;

}
