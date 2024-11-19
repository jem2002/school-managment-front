export class NuevoUsuario {
    username: string;
    password: string;
    enabled: boolean;
    roles: string[] = [];

    constructor(){
        this.enabled = true;
    }
}
