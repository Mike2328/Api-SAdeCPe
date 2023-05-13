import { CargoEntity } from 'src/cargo/entity/cargo-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('DEPARTAMENTO')
export class DepartamentEntity {
    @PrimaryGeneratedColumn({name: "ID_DEPARTAMENTO", primaryKeyConstraintName: "PRIMARY", type: "int"})
    id: number;

    @Column({name: "NOMBRE" ,type: "varchar", length: 50, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION" ,type:"varchar", length: 200, nullable: false})
    description: string;

    @Column({name: "FECHA_CREACION", type: "varchar", length: 10, nullable: false})
    creationDate: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @OneToMany((type) => CargoEntity, (cargo) => cargo.departament)
    cargos: CargoEntity[];
}