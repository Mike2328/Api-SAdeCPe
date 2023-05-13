import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("asistencia")
export class AssistanceEntity {
    @PrimaryGeneratedColumn({name: "ID_ASISTENCIA", type: 'int', primaryKeyConstraintName:"PRIMARY"})
    id:number;

    @Column({name: "ID_SESION", type: 'int', nullable: false})
    sessionId: number;

    @Column({name: "ID_COLABORADOR", type: 'int', nullable: false})
    collaboratorId: number;

    @Column({name: "CALIFICACION", type: 'double', nullable: true})
    qualification: number;

    @Column({name: "CERTIFICADO", type: 'longtext', nullable:true})
    certificate: string;

    @Column({name: "DESCRIPCION", type: 'varchar', length: 200, nullable: true})
    description: string;

    @Column({name: "FECHA_CREACION", type: 'varchar', length: 15, nullable: false})
    creationDate: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;
}