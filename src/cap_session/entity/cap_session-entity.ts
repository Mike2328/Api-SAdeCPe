import { AssistanceEntity } from "src/assistance/entity/assistance-entity";
import { CapacitationEntity } from "src/capacitation/entity/capacitation-entity";
import { CenterEntity } from "src/center/entity/center-entity";
import { CollaboratorEntity } from "src/collaborator/entity/collaborator-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cap_sesion")
export class CapSessionEntity {
    @PrimaryGeneratedColumn({name:"ID_SESION", type: "int"})
    id: number;

    @Column({name: "ID_CAP", type: "int", nullable: false})
    capId: number;

    @Column({name: "ID_CAPACITADOR", type: "int", nullable: false})
    trainerId: number;

    @Column({name: "ID_CTR_CAP", type: "int", nullable: false})
    centerId: number;

    @Column({name: "RANGO_FECHA", type: "varchar", length: 25, nullable: false})
    dates: string;

    @Column({name: "HORARIO", type: "varchar", length: 16, nullable: false})
    schedule: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @Column({name: "COMENTARIO", type: "varchar", length: 200, nullable: true})
    comment: string;

    @ManyToOne((type) => CapacitationEntity, (cap) => cap.sessions)
    @JoinColumn({
        name: "ID_CAP", 
        referencedColumnName:"id",
        foreignKeyConstraintName: "CAP_SESION_CAPACITACION_FK"
    })
    cap: CapacitationEntity;

    @OneToMany((type) => AssistanceEntity, (assistance) => assistance.capSession)
    @JoinColumn({
        name: "ID_SESION", 
        referencedColumnName:"capId"
    })
    assistances: CollaboratorEntity[];

    @OneToOne((type) => CenterEntity)
    @JoinColumn({
        name: "ID_CTR_CAP",
        referencedColumnName: "id",
        foreignKeyConstraintName: "CAP_SESSION_CTR_FK"
    })
    center: CenterEntity;
}