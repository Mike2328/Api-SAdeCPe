import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { TagEntity } from '../entity/tag-entity';
import { TagService } from '../service/tag.service';
import { BaseService } from 'src/base/base.service';
import { query } from 'express';

@Controller('tag')
export class TagController extends BaseController<TagEntity>{
    constructor(private readonly tagService: TagService){
        super();
    }

    getService(): BaseService<TagEntity> {
        return this.tagService;
    }

    @Get("list")
    async findTags(@Query() query){
        return this.tagService.findTags(query);
    }
}