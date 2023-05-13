import { type } from "os";
import { TypeStateEntity } from "src/type-state/entity/type-state-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("estado")
export class StateEntity {
    @PrimaryGeneratedColumn({name: "ID_ESTADO", type: "int", primaryKeyConstraintName: "PRIMARY"})
    id: number;

    @Column({name: "ID_TIPO", type: "int"})
    stateType: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION", type: "varchar", length: 200, nullable: false})
    description: string;

    @Column({name: "COLOR", type: "varchar", length: 20})
    color: string;

    @Column({name: "FECHA_CREACION", type: "varchar", length: 10, nullable: false})
    creationDate: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @OneToOne(() => TypeStateEntity)
    @JoinColumn({
        name: "ID_TIPO",
        referencedColumnName: "id"
    })
    typeState: TypeStateEntity;
}