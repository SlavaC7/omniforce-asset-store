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

@Controller('assets')
@UseGuards(JwtUserGuard)
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {
    }

    @Post('/create/:userId')
    async createAsset(@Param('userId') userId: number, @Body() newAsset: CreateAssetDto) {
        return await this.assetsService.createAsset(newAsset, userId);
    }

    @UseInterceptors(FilesInterceptor('pictures'))
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

    @Get(':id')
    async getAsset(@Param('id') id: number) {
        return await this.assetsService.getAsset(id);
    }

    @Delete(':id')
    async deleteAsset(@Param('id') id: number) {
        return await this.assetsService.deleteUser(id);
    }
}
