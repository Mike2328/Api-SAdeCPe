import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("etiqueta")
export class TagEntity {
    @PrimaryGeneratedColumn({name: "ID_ETIQUETA", type: "int"})
    id: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100, nullable: false})
    name: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}