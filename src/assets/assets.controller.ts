import {Controller, HttpStatus, Param, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AssetsService} from './assets.service';
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {
    }


}
