import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("capacitador")
export class TrainerEntity {
    @PrimaryGeneratedColumn({name: "ID_CAPACITADOR", type: "int"})
    id: number;

    @Column({name: "NOMBRE", type: "varchar", length: 50,  nullable: false})
    name: string;

    @Column({name: "CED", type: "varchar", length:  16, nullable: false})
    identification: string;

    @Column({name: "FOTO", type: "longtext"})
    photo: string;

    @Column({name: "ID_ORG", type: "int", nullable: false})
    orgId: number;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}