import { StateEntity } from "src/state/entity/state-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("tipo_estado")
export class TypeStateEntity {
    @PrimaryGeneratedColumn({name: "ID_TIPO", type: "int", primaryKeyConstraintName: "PRIMARY"})
    id: number;

    @Column({name: "NOMBRE_TIPO", type: "varchar", length: 20})
    nameType: number;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @OneToMany(() => StateEntity, (stateEntity) => stateEntity.typeState)
    @JoinColumn({
        name: "id",
        referencedColumnName: "stateType"
    })
    stateEntity: StateEntity[];
}