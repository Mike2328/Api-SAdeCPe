import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartamentModule } from './departament/departament.module';
import { CargoModule } from './cargo/cargo.module';
import { StateModule } from './state/state.module';
import { PriorityModule } from './priority/priority.module';
import { CenterModule } from './center/center.module';
import { TypeStateModule } from './type-state/type-state.module';
import { ImageModule } from './image/image.module';
import { OrganizationModule } from './organization/organization.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { ApplicationModule } from './application/application.module';
import { TagModule } from './tag/tag.module';
import { TrainerModule } from './trainer/trainer.module';
import { CapTagsModule } from './cap_tags/cap_tags.module';
import { CapSessionModule } from './cap_session/cap_session.module';
import { CapacitationModule } from './capacitation/capacitation.module';
import { ReasonModule } from './reason/reason.module';
import { AssistanceModule } from './assistance/assistance.module';
import { AuthModule } from './auth/auth.module';
import { StadisticsModule } from './stadistics/stadistics.module';
import { MainModule } from './main/main.module';
import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port: 3306,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true
    }),
    DepartamentModule,
    CargoModule,
    StateModule,
    PriorityModule,
    CenterModule,
    TypeStateModule,
    ImageModule,
    OrganizationModule,
    CollaboratorModule,
    ApplicationModule,
    TagModule,
    TrainerModule,
    CapTagsModule,
    CapSessionModule,
    CapacitationModule,
    ReasonModule,
    AssistanceModule,
    // ConfigModule.forRoot({
    //   envFilePath: `.env`,
    //   isGlobal: true
    // }),
    AuthModule,
    StadisticsModule,
    MainModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
