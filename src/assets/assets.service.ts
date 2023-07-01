import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AssetEntity} from "../entity/asset.entity";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {UsersService} from "../users/users.service";
import {AssetQueryDto} from "../dto/asset-query.dto";

@Injectable()
export class AssetsService {
    constructor(
        @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
        private readonly userService: UsersService,
    ) {
    }

    async createAsset(newAsset: CreateAssetDto, userUUID: string) {
        const user = await this.userService.getUser(userUUID);
        return (await this.assetRepository.insert({...newAsset, user})).raw[0].uuid;
    }

    async setPictures(uuid: string, pictures: Array<Buffer>) {
        const res = await this.assetRepository.update(
            {uuid},
            {pictures}
        );

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }

    async getAsset(uuid: string) {
        return await this.assetRepository.findOneOrFail({where: {uuid}, relations: ['user']});
    }

    async getAssetByQuery(query: AssetQueryDto) {
        return await this.assetRepository.findBy(query);
    }

    async deleteUser(uuid: string) {
        const res = await this.assetRepository.delete(uuid);

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }
}
