import { Aula } from "./aula";
import { Clase } from "./clase";
import { Estudiante } from "./estudiante";

export class Grado {
    id: number;
    nombre: string;
    aulas: Aula[];
}
