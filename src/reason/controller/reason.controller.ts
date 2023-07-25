import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/base/base.controller';
import { ReasonEntity } from '../entity/reason-entity';
import { ReasonService } from '../service/reason.service';
import { BaseService } from 'src/base/base.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reason')
export class ReasonController extends BaseController<ReasonEntity>{
    constructor(private readonly reasonService: ReasonService){
        super();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id:number){
        return await this.reasonService.delete(id);
    }

    getService(): BaseService<ReasonEntity> {
        return this.reasonService;
    }

    @UseGuards(JwtAuthGuard)
    @Get("list")
    async findReasons(@Query() query){
        return await this.reasonService.findReasons(query);
    }
}