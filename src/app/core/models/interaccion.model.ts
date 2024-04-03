import { OportunidadModel } from "./oportunidad.model";
import { UsuarioModel } from "./usuario.model";

export class InteraccionModel {
    constructor(
        public refOportunity: OportunidadModel["_id"],
        public descriptionInteraction: string,
        public actionInteraction: string,
        public userCreate?: UsuarioModel["_id"],
        public createdAt?: Date,
        public updateAt?: Date,
        public readonly _id?: string
    ) {}
}