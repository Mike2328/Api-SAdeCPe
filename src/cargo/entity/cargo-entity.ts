import { DepartamentEntity } from 'src/departament/entity/departament-entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn } from 'typeorm';

@Entity('CARGO')
export class CargoEntity {
    @PrimaryGeneratedColumn({name: "ID_CARGO", primaryKeyConstraintName: "PRIMARY", type: "int"})
    id: number;

    @Column({name: "ID_DEPARTAMENTO", type: "int", nullable: false})
    departamentId: number;

    @Column({name: "NOMBRE", type: "varchar", length: 50, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION", type: "varchar", length: 200, nullable: false})
    description: string;

    @Column({name: "FECHA_CREACION", type: "varchar", length: 10, nullable: false})
    creationDate: string;

    @Column({name: "JEFE_AREA", type: 'bit', transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    manager: boolean;

    @Column({name: "ACTIVO", type: 'bit', transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @ManyToOne((type) => DepartamentEntity)
    @JoinColumn({
        name: "ID_DEPARTAMENTO",
        referencedColumnName: "id",
        foreignKeyConstraintName: "DEPARTAMENTO_DPT_GERENTE_FK"
    })
    departament: DepartamentEntity;
}