import {
    Body,
    Controller, Delete, Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Post,
    UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AssetsService} from './assets.service';
import {CreateAssetDto} from "../dto/create-asset.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import {JwtUserGuard} from "../authorization/auth.guard";
import {
    ApiBadRequestResponse, ApiBody, ApiConsumes,
    ApiCreatedResponse, ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {UserDto} from "../dto/user.dto";
import {AssetDto} from "../dto/asset.dto";

@ApiTags('Asset')
@ApiUnauthorizedResponse({
    description: "Your access token is not valid or expired."
})
@Controller('assets')
@UseGuards(JwtUserGuard)
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {
    }

    @ApiOperation({summary: "Create a new asset"})
    @ApiCreatedResponse({
        description: "Asset has been created. Returned value is an id of an created object",
        type: Number
    })
    @ApiBadRequestResponse({description: "Provided data is not valid. Data must be like an CreateAssetDto. Check if user with provided if exist"})
    @Post('/create/:userId')
    async createAsset(@Param('userId') userId: number, @Body() newAsset: CreateAssetDto) {
        return await this.assetsService.createAsset(newAsset, userId);
    }

    @ApiOperation({summary: "Add an pictures (for preview) to asset (jpeg only)"})
    @ApiCreatedResponse({
        description: "Pictures set to the user with 'id'. If pictires set successful, return '1'",
        type: Number
    })
    @ApiBadRequestResponse({description: "Can't find user with provided 'id'"})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('pictures'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                picture: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Post('/:id/setPictures')
    async setPictures(
        @Param('id') id: number,
        @UploadedFiles(
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
        ) pictures: Array<Express.Multer.File>) {
        return await this.assetsService.setPictures(id, pictures.map(picture => picture.buffer));
    }

    @ApiOperation({summary: "Return an asset with provided 'id'"})
    @ApiOkResponse({description: "Asset with provided 'id'.", type: AssetDto})
    @ApiBadRequestResponse({description: "Can't find asset with provided 'id'"})
    @Get(':id')
    async getAsset(@Param('id') id: number) {
        return await this.assetsService.getAsset(id);
    }

    @ApiOperation({summary: "Delete an asset with provided 'id'"})
    @ApiOkResponse({description: "Asset with provided 'id' has been deleted", type: Number})
    @ApiBadRequestResponse({description: "Can't find asset with provided 'id'"})
    @Delete(':id')
    async deleteAsset(@Param('id') id: number) {
        return await this.assetsService.deleteUser(id);
    }
}
