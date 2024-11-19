import { Clase } from "./clase";
import { DiaSemana } from "./dia-semana";

export class Frecuencia {
    id: number;
    horario_inicio: string;
    horario_fin: string;
    dia: DiaSemana;
    clase: Clase;
}
