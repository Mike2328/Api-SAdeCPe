import { CargoEntity } from "src/cargo/entity/cargo-entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("COLABORADOR")
export class CollaboratorEntity {
    @PrimaryGeneratedColumn({name: "ID_COLABORADOR", type: "int"})
    id: number;

    @Column({name: "ID_CARGO", type: "int", nullable: false})
    employeePositionId: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100,  nullable: false})
    name: string;

    @Column({name: "APELLIDO", type: "varchar", length:  200, nullable: false})
    lastName: string;

    @Column({name: "CED", type: "varchar", length:  200, nullable: false})
    identification: string;

    @Column({name: "FOTO", type: "longtext"})
    photo: string;

    @Column({name: "FECHA_INGRESO", type: "varchar", length:  10, nullable: false})
    admissionDate: string;

    @Column({name: "COD_REFERENCIA", type: "varchar", length:  10, nullable: false})
    refNumber: number;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @ManyToOne((type) => CargoEntity)
    @JoinColumn({
        name: "ID_CARGO",
        referencedColumnName: "id",
        foreignKeyConstraintName: "CARGO_COLABORADOR_FK"
    })
    position: CargoEntity;
}