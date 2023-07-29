import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
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
import {Roles} from "../role/roles.decorator";
import {Role} from "../role/role.enum";
import {RolesGuard} from "../role/roles.guard";
import {UpdateUserDto} from "../dto/update-user.dto";
import {JwtUserGuard} from "../authorization/auth.guard";

@ApiTags('User')
@ApiBearerAuth("access-token")
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
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
                nickname: {
                    type: 'string',
                    format: 'string',
                    example: 'Xepobopa'
                },
                desc: {
                    type: 'string',
                    format: 'string',
                    example: 'description'
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('create')
    async create(
        @Body() newUser: CreateUserDto,
        @Req() req: Request,
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
        const token = req.headers.authorization.replace('Bearer ', '');
        const sub = this.jwtService.decode(token).sub;
        const uuid = await this.usersService.create(newUser, sub);
        await this.usersService.setAvatar(uuid, avatar.originalname, avatar.buffer);
        return uuid;
    }

    @ApiOperation({summary: "Update a user with provided 'uuid'"})
    @ApiOkResponse({description: "Return new changed user .", type: UserDto})
    @ApiBadRequestResponse({description: "Can't find user with provided 'uuid'"})
    @ApiBody({description: "Pass the options you want to change", type: UpdateUserDto})
    @Patch(':uuid')
    async updateUser(@Param("uuid") uuid: string, @Body() changes: UpdateUserDto) {
        return await this.usersService.updateUser(uuid, changes);
    }

    @ApiOperation({summary: "Update a user avatar by provided 'uuid'"})
    @ApiOkResponse({description: "Return new changed user .", type: Number})
    @ApiBadRequestResponse({description: "Can't find user with provided 'uuid'"})
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
    @Patch(':uuid/setAvatar')
    async changeAvatar(
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
        ) avatar: Express.Multer.File
    ) {
        console.log(avatar);
        return await this.usersService.setAvatar(uuid, avatar.originalname, avatar.buffer);
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

    @ApiOperation({summary: "Block user with provided 'uuid'. User who blocks must be an Admin"})
    @ApiOkResponse({description: "User with provided 'uuid' has been blocked", type: UserDto})
    @ApiBadRequestResponse({description: "Can't find user with provided 'uuid'"})
    @Get('block/:uuid')
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    async blockUser(@Param('uuid') uuid: string) {
        return await this.usersService.blockUser(uuid);
    }
}
