import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("RAZON_FONDO_GRATUITO")
export class ReasonEntity {
    @PrimaryGeneratedColumn({name: "ID_RAZON", type: "int"})
    id: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION", type: "varchar", length: 200, nullable: false})
    description: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}