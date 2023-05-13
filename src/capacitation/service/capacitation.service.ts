import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { CapacitationEntity } from '../entity/capacitation-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TagEntity } from 'src/tag/entity/tag-entity';
import { CapSessionEntity } from 'src/cap_session/entity/cap_session-entity';
import { AssistanceEntity } from 'src/assistance/entity/assistance-entity';

@Injectable()
export class CapacitationService extends BaseService<CapacitationEntity>{
    constructor(@InjectRepository(CapacitationEntity) private capacitationRP: Repository<CapacitationEntity>, 
                @InjectRepository(TagEntity) private tagRP: Repository<TagEntity>,
                @InjectRepository(CapSessionEntity) private capSessionRP: Repository<TagEntity>,
                @InjectRepository(AssistanceEntity) private assistanceRP: Repository<AssistanceEntity>){
        super();
    }

    async createCap(entity){
        // const response = {};
        const response = await this.capacitationRP.save(entity);
        const successfull = (response["id"] != undefined);
        
        //Si se guardo correctamente la capacitacion procedemos a guardar el detalle
        if(successfull){
            let new_tags = entity["tags"].filter(tag => tag["isNew"] != undefined).map((tag) => {return {"name": tag["label"], "active": true} });
            let save_tags = [];

            if(new_tags.length > 0)
                save_tags = await this.tagRP.save(new_tags);

            let sessionSave = {};
            let responseSession = {};

            for(let session of entity["sessions"]){
                sessionSave = {
                    capId: response["id"],
                    trainerId: session["trainerId"],
                    centerId: session["center"]["id"],
                    dates: session["dates"],
                    schedule: session["timeRange"].join(" - ")
                };

                responseSession = await this.capSessionRP.save(sessionSave)
                const successfull_session = (responseSession["id"] != undefined);

                if(successfull_session){
                    let responseAssistance = {};  
                    let assistanceSave = {};

                    for(let id of session["collaborators"].split(",")){
                        assistanceSave = {
                            sessionId: responseSession["id"],
                            collaboratorId: parseInt(id),
                            qualification: null,
                            certificate: null,
                            description: null,
                            creationDate: entity["creationDate"],
                            active: true
                        };

                        responseSession = await this.assistanceRP.save(assistanceSave)
                    }
                }
            }
        }

        return response;
    }

    async findCaps(query){
        let itemsperPage = query.limit == undefined ? 10 : parseInt(query.limit);
        let page = query.page == undefined ?  1 : parseInt(query.page);
        let search = query.search == undefined ? "" : query.search;
        let sortBy = query.sortBy == undefined ?  ["cap.id", "ASC"] : query.sortBy;
        let state = query.state == undefined ? 0 : query.state;
        let priority = query.priority == undefined ? 0 : query.priority;
        let organization = query.org == undefined ? 0 : query.org;

        if(sortBy == "character_asc"){
            sortBy = ["cap.name", "ASC"];
        }else if(sortBy == "character_desc"){
            sortBy = ["cap.name", "DESC"];
        }else if(sortBy == "date_asc"){
            sortBy = ["cap.id", "ASC"];
        }else if(sortBy == "date_desc")
            sortBy = ["cap.id", "DESC"];

        let QB = this.capacitationRP
            .createQueryBuilder("cap")
            .leftJoinAndSelect('cap.org', 'org')
            .leftJoinAndSelect('cap.state', 'state')
            .leftJoinAndSelect('cap.priority', 'priority')
            .leftJoinAndSelect('cap.sessions', 'sessions')
            .where("cap.name LIKE :search", { search: `%${search}%` })
            .andWhere(new Brackets((subcondition) => {
                if(state != 0 && priority != 0 && organization != 0){
                    subcondition.where("state.id = :depId and priority.id = :priority and org.id = :org", {state: state, priority: priority, org: organization})
                }else if(state != 0){
                    subcondition.andWhere("state.id = :id", {id: state})    
                }else if(priority != 0){
                    subcondition.andWhere("priority.id = :id", {id: priority})
                }else if(organization != 0)
                    subcondition.andWhere("org.id = :id", {id: organization})
            }));

        const response = await QB
                        .orderBy(sortBy[0], sortBy[1])
                        .skip(itemsperPage * (page - 1))
                        .take(itemsperPage)
                        .getMany();
        

        const responseCount = await QB
                            .getCount().then((items) => {
                                return [items, Math.ceil(items / itemsperPage)];
                            });

        let totalItems = responseCount[0];
        let pageCount = responseCount[1];

        const returnResponse = {
            data: response,
            itemsperPage: itemsperPage,
            totalItems: totalItems,
            pageCount: pageCount,
            currentPage: page
        }

        return returnResponse;
    }

    getRepository(): Repository<CapacitationEntity> {
        return this.capacitationRP;   
    }
}