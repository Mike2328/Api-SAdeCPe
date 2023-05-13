import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("solicitud")
export class ApplicationEntity {
    @PrimaryGeneratedColumn({name: "ID_SOLICITUD", type: "int"})
    id: number;

    @Column({name: "ID_CAP", type: "int", nullable: false})
    capId: number;

    @Column({name: "ID_COLABORADOR", type: "int", nullable: false})
    collaboratorId: number;

    @Column({name: "NOMBRE", type: "varchar", length: 50, nullable: false})
    name: string;

    @Column({name: "APELLIDO", type: "varchar", length: 50, nullable: false})
    lastName: string;

    @Column({name: "ASUNTO", type: "varchar", length: 200, nullable: false})
    affair: string;

    @Column({name: "DESCRIPCION", type: "varchar", length: 200, nullable: true})
    description: string;

    @Column({name: "HORA", type: "varchar", length: 15, nullable: true})
    date: string;

    @Column({name: "ORIGEN", type: "longtext"})
    origin: string;

    @Column({name: "ACEPTADA", type: 'bit', transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    accept: boolean;
}