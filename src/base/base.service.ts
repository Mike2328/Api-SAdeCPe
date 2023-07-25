import { NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';

export abstract class BaseService<T> {
    abstract getRepository(): Repository<T>;

    async findAll(query): Promise<T[]>{
        return await this.getRepository()
                .createQueryBuilder("base")
                .where("base.active = :state", {state: true})
                .andWhere( new Brackets((subCondition) => {
                    if(query.field && query.value){
                        subCondition.where(`base.${query.field} = :value`, {value: query.value})
                    }
                }))
                .getMany();
    }

    async findOne(id: any): Promise<T>{
        return await this.getRepository().findOne(id);
    }

    async save(Entity: T): Promise<T>{
        return await this.getRepository().save(Entity);
    }

    async update(entity: any): Promise<any>{
        let keyEntity = Object.keys(entity);
        let entityUpdate = {};

        keyEntity.forEach(key => {
            if((typeof entity[key]) != "object" && !key.includes("without"))
                entityUpdate[key] = entity[key];
        });

        if(Object.keys(entityUpdate).length > 0){
            const response = await this.getRepository().update(entityUpdate["id"], entityUpdate);
            return (response["affected"] > 0)
                ? { success: true, message: 'Exito al actualizar el registro'} 
                : { success: false, message: 'Error al actualizar el registro'};
        }else
            return { success: false, message: 'Error al actualizar el registro'};
    }

    async saveMany(Entities: T[]):  Promise<T[]>{
        return await this.getRepository().save(Entities);
    }
}