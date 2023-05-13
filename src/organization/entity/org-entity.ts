import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ORGANIZACION")
export class OrgEntity {
    @PrimaryGeneratedColumn({name: "ID_ORG", type: "int", primaryKeyConstraintName: "PRIMARY"})
    id: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100,  nullable: false})
    name: string;

    @Column({name: "DIRECCION", type: "varchar", length:  200, nullable: false})
    address: string;

    @Column({name: "DESCRIPCION", type: "varchar", length:  200, nullable: false})
    description: string;

    @Column({name: "FOTO", type: "longtext"})
    photo: string;

    @Column({name: "FECHA_CREACION", type: "varchar", length:  10, nullable: false})
    creationDate: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}
