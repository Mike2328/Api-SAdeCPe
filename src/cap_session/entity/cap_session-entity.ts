import { CapacitationEntity } from "src/capacitation/entity/capacitation-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
    dates: number;

    @Column({name: "HORARIO", type: "varchar", length: 16, nullable: false})
    schedule: string;

    @ManyToOne((type) => CapacitationEntity, (cap) => cap.sessions)
    @JoinColumn({
        name: "ID_CAP", 
        referencedColumnName:"id",
        foreignKeyConstraintName: "CAP_SESION_CAPACITACION_FK"
    })
    cap: CapacitationEntity;
}