import { Aula } from "./aula";
import { Curso } from "./curso";
import { Empleado } from "./empleado";
import { Frecuencia } from "./frecuencia";
import { Material } from "./material";

export class Clase {
    id: number;
    aula: Aula;
    curso: Curso;
    empleado: Empleado;
    frecuencias: Frecuencia[];
    materiales: Material[];
}
