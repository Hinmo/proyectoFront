export class UsuarioModel{
    constructor(
        public nombre: string,
        public email: string,
        public celular: number,
        public direccion: string,
        public tipoDocumento: string,
        public numeroDocumento: string,
        public login: string,
        public password: string,
        public rol?: string,
        public estado?: boolean,
        public createdAt?: Date,
        public updateAt?: Date,
        public readonly _id?:string,
    )
    {}
}