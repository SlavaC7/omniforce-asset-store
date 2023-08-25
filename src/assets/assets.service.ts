import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AssetEntity} from "../entity/asset.entity";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {UsersService} from "../users/users.service";
import {AssetQueryDto} from "../dto/asset-query.dto";
import {UploadService} from "../upload/upload.service";

@Injectable()
export class AssetsService {
    constructor(
        @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
        private readonly userService: UsersService,
        private readonly uploadService: UploadService,
    ) {
    }

    async createAsset(newAsset: CreateAssetDto, userUUID: string) {
        const user = await this.userService.getUserByUuid(userUUID);
        return (await this.assetRepository.insert({...newAsset, user})).raw[0].uuid;
    }

    async setPictures(uuid: string, pictures: Array<Express.Multer.File>) {
        const filenames = [];
        const assetToUpdate = await this.assetRepository
            .createQueryBuilder()
            .update()
            .where(
                "uuid = :uuid",
                { uuid }
            );

        for (const pic of pictures) {
            filenames.push(this.uploadService.uploadAsset(`${uuid}~_~${pic.originalname}`, pic.buffer));

            console.log(pic.originalname);
            await assetToUpdate.set({ pictures: () => `array_append("pictures", '${filenames}')` }).execute();
        }
    }

    async getAsset(uuid: string) {
        return await this.assetRepository.findOneOrFail({where: {uuid}, relations: ['user']});
    }

    async getAssetByQuery(query: AssetQueryDto) {
        return await this.assetRepository.findBy(query);
    }

    async deleteUser(uuid: string) {
        const res = await this.assetRepository.delete({uuid});

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }
}
