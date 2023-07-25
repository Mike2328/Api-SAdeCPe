import { CapacitationEntity } from "src/capacitation/entity/capacitation-entity";
import { TagEntity } from "src/tag/entity/tag-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cap_etiqueta")
export class CapTagsEntity {
    @PrimaryGeneratedColumn({name:"ID_CAP_ETIQUETA", type: "int"})
    id: number;

    @Column({name: "ID_CAP", type: "int", nullable: false})
    capId: number;

    @Column({name: "ID_ETIQUETA", type: "int", nullable: false})
    tagId: number;

    @Column({name: "ACTIVO", type: "bit", transformer: { from: (v: Buffer) => !!v.readInt8(0), to: (v) => v }, nullable: false})
    active: boolean;

    @ManyToOne((type) => CapacitationEntity, (cap) => cap.tags)
    @JoinColumn({
        name: "ID_CAP",
        referencedColumnName:"id",
        foreignKeyConstraintName: "CAPS_TAGS_CAPACITACION_FK"
    })
    cap: CapacitationEntity;

    @OneToOne((type) => TagEntity)
    @JoinColumn({
        name: "ID_ETIQUETA",
        referencedColumnName: "id",
        foreignKeyConstraintName: "CAPS_TAGS_ETIQUETA_FK"
    })
    tag: TagEntity;
}