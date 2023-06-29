import {Module} from '@nestjs/common';
import {AssetsService} from './assets.service';
import {AssetsController} from './assets.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthorizationModule} from "../authorization/authorization.module";
import {AssetEntity} from "../entity/asset.entity";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([AssetEntity]),
        AuthorizationModule,
        UsersModule
    ],
    controllers: [AssetsController],
    providers: [AssetsService]
})
export class AssetsModule {
}
