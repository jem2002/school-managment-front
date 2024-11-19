import { Estudiante } from "./estudiante";

export class Asistencia {
    id: number;
    fecha: string;
    estado: string;
    estudiante: Estudiante;

    constructor(){
        this.estado = 'FALTA';
        this.obtenerFechaActual();
        
    }

    obtenerFechaActual(): void {
        let d = new Date();

        let year  = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, "0");
        let day = d.getDate()

        this.fecha = day + "/" + month + "/" + year;
    }
}
