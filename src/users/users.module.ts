import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {JwtModule} from "@nestjs/jwt";
import {AuthorizationModule} from "../authorization/authorization.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forFeature([UserEntity]),
        AuthorizationModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
