import { CapSessionEntity } from "src/cap_session/entity/cap_session-entity";
import { CapTagsEntity } from "src/cap_tags/entity/cap_tags-entity";
import { OrgEntity } from "src/organization/entity/org-entity";
import { PriorityEntity } from "src/priority/entity/priority-entity";
import { ReasonEntity } from "src/reason/entity/reason-entity";
import { StateEntity } from "src/state/entity/state-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("CAPACITACION")
export class CapacitationEntity {
    @PrimaryGeneratedColumn({name: "ID_CAP", primaryKeyConstraintName: "PRIMARY", type: "int", })
    id: number;

    @Column({name: "ID_ESTADO", type: "int", nullable: false})
    stateId: number;

    @Column({name: "ID_NVL_PRIORI", type: "int", nullable: false})
    levelPrioryId: number;

    @Column({name: "ID_ORG", type: "int", nullable: false})
    orgId: number;

    @Column({name: "ID_RAZON", type: "int", nullable: true})
    reasonId: number;

    @Column({name: "NOMBRE", type: "varchar", length: 100, nullable: false})
    name: string;

    @Column({name: "DESCRIPCION", type: "varchar", length: 200, nullable: false})
    description: string;

    @Column({name: "COSTO_UNITARIO", type: "double", nullable: false})
    costUnit: number;

    @Column({name: "COSTO_FINAL", type: "double", nullable: false})
    costFinal: number;

    @Column({name: "INATEC_FONDO", type: "double", nullable: false})
    inatecBackground: number;

    @Column({name: "CERTIFICADO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    certificated: number;

    @Column({name: "EXTERNA", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    external: number;

    @Column({name: "FECHA_CREACION", type: "varchar", length: 10, nullable: false})
    creationDate: string;

    @Column({name: "CAP_TOTAL_ASIS", type: "varchar", length: 10, nullable: false})
    totalColEnrolled: string;

    @Column({name: "CAP_TOTAL_SESIONS", type: "varchar", length: 10, nullable: false})
    totalSession: string;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @Column({name: "COMENTARIO", type: "varchar", length: 200, nullable: true})
    comment: string;

    @OneToOne((type) => OrgEntity)
    @JoinColumn({
        name: "ID_ORG",
        referencedColumnName: "id",
        foreignKeyConstraintName: "ORG_CAPACITACION_FK"
    })
    org: OrgEntity;

    @OneToOne((type) => ReasonEntity)
    @JoinColumn({
        name: "ID_RAZON",
        referencedColumnName: "id",
        foreignKeyConstraintName: "RAZON_CAPACITACION_FK"
    })
    reason: ReasonEntity;

    @OneToOne((type) => PriorityEntity)
    @JoinColumn({
        name: "ID_NVL_PRIORI",
        referencedColumnName: "id",
        foreignKeyConstraintName: "NVL_CAPACITACION_FK"
    })
    priority: PriorityEntity;

    @OneToOne((type) => StateEntity)
    @JoinColumn({
        name: "ID_ESTADO",
        referencedColumnName: "id",
        foreignKeyConstraintName: "ESTADO_CAPACITACION_FK"
    })
    state: StateEntity;

    @OneToMany((type) => CapSessionEntity, (session) => session.cap)
    @JoinColumn({
        name: "ID_CAP", 
        referencedColumnName:"capId"
    }) 
    sessions: CapSessionEntity[];

    @OneToMany((type) => CapTagsEntity, (tag) => tag.cap)
    @JoinColumn({
        name: "ID_CAP", 
        referencedColumnName:"capId"
    }) 
    tags: CapSessionEntity[];
    
}