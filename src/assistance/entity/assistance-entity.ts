import { CapSessionEntity } from "src/cap_session/entity/cap_session-entity";
import { CollaboratorEntity } from "src/collaborator/entity/collaborator-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @Column({name: "COMENTARIO", type: "varchar", length: 200, nullable: true})
    comment: string;

    @ManyToOne((type) => CapSessionEntity, (capSession) => capSession.assistances)
    @JoinColumn({
        name: "ID_SESION", 
        referencedColumnName:"id",
        foreignKeyConstraintName: "CAP_SESION_ASISTENCIA_FK"
    })
    capSession: CapSessionEntity;

    @OneToOne((type) => CollaboratorEntity)
    @JoinColumn({
        name: "ID_COLABORADOR",
        referencedColumnName: "id",
        foreignKeyConstraintName: "COLABORADOR_INS_CAP_FK"
    })
    collaborator: CollaboratorEntity;
}