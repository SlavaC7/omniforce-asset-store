import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AssetEntity} from "../entity/asset.entity";
import {CreateAssetDto} from "../dto/create-asset.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class AssetsService {
    constructor(
        @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
        private readonly userService: UsersService,
    ) {
    }

    async createAsset(newAsset: CreateAssetDto, userId: number) {
        const user = await this.userService.getUser(userId);
        return (await this.assetRepository.insert({...newAsset, user})).identifiers[0].id;
    }

    async setPictures(id: number, pictures: Array<Buffer>) {
        const res = await this.assetRepository.update(
            id,
            {pictures}
        );

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${id}"`);
        return res.affected;
    }

    async getAsset(id: number) {
        return await this.assetRepository.findOneByOrFail({id});
    }

    async deleteUser(id: number) {
        const res = await this.assetRepository.delete(id);

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${id}"`);
        return res.affected;
    }
}
