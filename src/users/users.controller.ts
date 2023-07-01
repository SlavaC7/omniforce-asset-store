import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Post,
    Req,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {UserDto} from "../dto/user.dto";
import {JwtUserGuard} from "../authorization/auth.guard";

@ApiTags('User')
@ApiUnauthorizedResponse({
    description: "Your access token is not valid or expired."
})
@Controller('users')
@UseGuards(JwtUserGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {
    }

    @ApiOperation({summary: "Create a new user"})
    @ApiCreatedResponse({
        description: "User has been created. Returned value is an uuid of an created object",
        type: Number
    })
    @ApiBadRequestResponse({description: "Provided data is not valid. Needed 'nickname' - String, 'desc' - String"})
    @Post('create')
    async create(@Body() newUser: CreateUserDto, @Req() req: Request) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const sub = this.jwtService.decode(token).sub;
        return await this.usersService.create(newUser, sub);
    }

    @ApiOperation({summary: "Add an avatar to user (jpeg only)"})
    @ApiCreatedResponse({
        description: "Avatar set to the user with 'uuid'. If avatar set successful, return 1",
        type: Number
    })
    @ApiBadRequestResponse({description: "Can't find user with  provided 'uuid'"})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @Post(":uuid/setAvatar")
    async setAvatar(
        @Param('uuid') uuid: string,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: "image/jpeg"
                })
                .addMaxSizeValidator({
                    maxSize: 2 * 1000 * 1000
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) avatar: Express.Multer.File) {
        return await this.usersService.setAvatar(uuid, avatar.buffer);
    }

    @ApiOperation({summary: "Return a user with provided 'uuid'"})
    @ApiOkResponse({description: "User with provided 'uuid'.", type: UserDto})
    @ApiBadRequestResponse({description: "Can't find user with provided 'uuid'"})
    @Get('get/:uuid')
    async getUser(@Param('uuid') uuid: string) {
        return await this.usersService.getUser(uuid);
    }

    @ApiOperation({summary: "Delete user with provided 'uuid'"})
    @ApiOkResponse({description: "User with provided 'uuid' has been deleted", type: Number})
    @ApiBadRequestResponse({description: "Can't find user with provided 'uuid'"})
    @Delete('delete/:uuid')
    async deleteUser(@Param('uuid') uuid: string) {
        return await this.usersService.deleteUser(uuid);
    }
}
