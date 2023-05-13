import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("PRIORIDAD")
export class PriorityEntity {
    @PrimaryGeneratedColumn({name: "ID_NVL_PRIORI", type: "int", primaryKeyConstraintName: "PRIMARY"})
    id: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION", type: "varchar", length:200, nullable: false})
    description: string;

    @Column({name: "COLOR", type: "varchar", length: 20, nullable: false})
    color: string;

    @Column({name: "FECHA_CREACION", type: "varchar", length: 10, nullable: false})
    creationDate: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}