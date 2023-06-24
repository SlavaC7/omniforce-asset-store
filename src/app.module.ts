import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from './users/users.module';
import * as Joi from "joi";
import {AuthorizationModule} from "./authorization/authorization.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmAsyncConfig} from "./config/typeorm.config";
import {AssetsModule} from './assets/assets.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.string().required().default('5000'),
                AUDIENCE: Joi.string().required(),
                ISSUERBASEURL: Joi.string().required(),
                TOKENSIGNINGALG: Joi.string().valid('HS256', 'RS256'),
                NODE_ENV: Joi.string().valid("DEVELOPMENT", "RELEASE"),
                DOMAIN: Joi.string().required(),
                DB_HOST: Joi.string().required().default('localhost'),
                DB_PORT: Joi.number().required().default(5432),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE_NAME: Joi.string().required(),

            }),
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        UsersModule,
        AuthorizationModule,
        AssetsModule
    ],
})
export class AppModule {

}