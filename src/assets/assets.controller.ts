import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AssetsService} from './assets.service';
import {CreateAssetDto} from "../dto/asset/create-asset.dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import {JwtUserGuard} from "../authorization/auth.guard";
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
import {AssetDto} from "../dto/asset/asset.dto";
import {AssetQueryDto} from "../dto/asset/asset-query.dto";

@ApiTags('Asset')
@ApiBearerAuth("access-token")
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
        description: "Asset has been created. Returned value is an uuid of an created object",
        type: Number
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('pictures'))
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                pictures: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                    },
                },
                title: {type: 'string'},
                desc: {type: 'string'},
                price: {type: 'number'},
                rating: {type: 'number'},
                likes: {type: 'number'},
            },
        },
    })
    @ApiBadRequestResponse({description: "Provided data is not valid. Data must be like an CreateAssetDto. Check if user with provided if exist"})
    @Post('/create/:userUUID')
    async createAsset(
        @Param('userUUID') userUUID: string,
        @Body() newAsset: CreateAssetDto,
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: "/(jpg|jpeg|png|gif)$/"
                })
                .addMaxSizeValidator({
                    maxSize: 2 * 1000 * 1000
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) pictures: Array<Express.Multer.File>) {
        const asset = await this.assetsService.createAsset(newAsset, userUUID);
        await this.assetsService.setPictures(asset.uuid, pictures);
        return asset;
    }

    @Get('get')
    async getAssetsByQuery(@Query() query: AssetQueryDto) {
        return await this.assetsService.getAssetByQuery(query);
    }

    @ApiOperation({summary: "Return an asset with provided 'uuid'"})
    @ApiOkResponse({description: "Asset with provided 'uuid'.", type: AssetDto})
    @ApiBadRequestResponse({description: "Can't find asset with provided 'uuid'"})
    @Get(':uuid')
    async getAsset(@Param('uuid') uuid: string) {
        const asset = await this.assetsService.getAsset(uuid);
        console.log(asset)
        return asset;
    }

    @ApiOperation({summary: "Delete an asset with provided 'uuid'"})
    @ApiOkResponse({description: "Asset with provided 'uuid' has been deleted", type: Number})
    @ApiBadRequestResponse({description: "Can't find asset with provided 'uuid'"})
    @Delete(':uuid')
    async deleteAsset(@Param('uuid') uuid: string) {
        return await this.assetsService.deleteUser(uuid);
    }
}
