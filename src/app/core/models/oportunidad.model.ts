export class OportunidadModel {
    constructor(
        public nameOportunity: string,
        public descriptionOportunity: string,
        public stateOportunity: string,
        public userCreate: string,
        public userGestor: string | null,
        public userCliente: string,
        public createdAt?: Date,
        public updateAt?: Date,
        public readonly _id?: string
    ) {}
}