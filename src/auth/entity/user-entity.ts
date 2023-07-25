import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usuarios")
export class UserEntity {
    @PrimaryGeneratedColumn({name: "ID_USUARIO", type: "int", primaryKeyConstraintName: "PRIMARY"})
    userId: number;

    @Column({name: "NBR_USUARIO", type: "varchar", length: 20})
    username: string;

    @Column({name: "CONTRASENNA", type: "varchar", length: 20})
    password: string;
}