import { Usuario } from "../auth/models/usuario";
import { Especialidad } from "./especialidad";

export class Empleado {
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
    especialidades: Especialidad[];
    usuario: Usuario;
}
