import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("cap_etiqueta")
export class CapTagsEntity {
    @PrimaryGeneratedColumn({name:"ID_CAP_ETIQUETA", type: "int"})
    id: number;

    @Column({name: "ID_CAP", type: "int", nullable: false})
    capId: number;

    @Column({name: "ID_ETIQUETA", type: "int", nullable: false})
    tagId: number;
}