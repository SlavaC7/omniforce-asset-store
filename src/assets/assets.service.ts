import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity } from '../entity/asset.entity';
import { CreateAssetDto } from '../dto/asset/create-asset.dto';
import { UsersService } from '../users/users.service';
import {
  AssetBasicQuery,
  AssetQueryDto,
  AssetTranslateQuery,
} from '../dto/asset/asset-query.dto';
import { UploadService } from '../upload/upload.service';
import { AssetTranslateEntity } from '../entity/asset-translate.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetTranslateEntity)
    private assetTranslateEntity: Repository<AssetTranslateEntity>,
    private readonly userService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  async createAsset(newAsset: CreateAssetDto, userUUID: string) {
    const user = await this.userService.getUserByUuid(userUUID);
    console.log('createAsset => cmplete user');

    const userTrans: AssetTranslateEntity[] = newAsset.lang.map((value) => {
      console.log('createAsset => lang =>', JSON.stringify(value));
      //@ts-ignore
      const obj = JSON.parse(value as string);
      const newUserTrans = new AssetTranslateEntity();
      newUserTrans.language = obj.language;
      newUserTrans.title = obj.title;
      newUserTrans.desc = obj.desc;
      return newUserTrans;
    });

    console.log('createAsset => userTrans');

    const asset = new AssetEntity();

    console.log('createAsset => asset');

    asset.user = user;
    console.log('createAsset => asset.user');

    asset.translations = userTrans;
    console.log('createAsset => asset.translations');

    asset.price = newAsset.price;

    console.log('createAsset => asset.price');

    console.log(asset);
    return await this.assetRepository.save(asset);
  }

  async setPictures(uuid: string, pictures: Array<Express.Multer.File>) {
    const urls: string[] = [];
    for (const pic of pictures) {
      urls.push(
        await this.uploadService.uploadAsset(
          `${uuid}+${pic.originalname}`,
          pic.buffer,
        ),
      );
    }

    await this.assetRepository
      .createQueryBuilder()
      .update()
      .set({
        pictures: urls,
      })
      .where('uuid = :uuid', { uuid })
      .execute();
  }

  async setFile(uuid: string, file: Express.Multer.File) {
    const buffer = file.buffer;
    console.log('setFile => initial =>', file);
    console.log('setFile => start');
    console.log('setFile => file.buffer', buffer);

    const url = await this.uploadService.uploadAsset(
      `file:${uuid}_${file.originalname}`,
      buffer,
    );
    console.log('setFile => url');
    await this.assetRepository
      .createQueryBuilder()
      .update()
      .set({
        file: url,
      })
      .where('uuid = :uuid', { uuid })
      .execute();

    console.log('setFile => finish');
  }

  async getAsset(uuid: string) {
    return await this.assetRepository.findOneOrFail({
      where: { uuid },
      relations: ['user', 'translations'],
    });
  }

  async getAssetByQuery(query: AssetQueryDto) {
    console.log(query);
    const queryBuilder = this.assetRepository.createQueryBuilder('asset');
    queryBuilder.leftJoinAndSelect('asset.translations', 'translations');
    queryBuilder.leftJoinAndSelect('asset.user', 'user');
    queryBuilder.leftJoinAndSelect('user.translations', 'translationsUser');

    const assetsFields = ['price', 'rating', 'uuid', 'id'];

    for (const param in query) {
      if (assetsFields.includes(param)) {
        queryBuilder.andWhere(`asset.${param} = :${param}`, {
          [param]: query[param],
        });
      } else if (param === 'userUuid') {
        queryBuilder.andWhere(`user.uuid = :uuid`, { uuid: query[param] });
      } else {
        queryBuilder.andWhere(`translations.${param} = :${param}`, {
          [param]: query[param],
        });
        queryBuilder.andWhere(`translationsUser.${param} = :${param}`, {
          [param]: query[param],
        });
      }
    }
    return await queryBuilder.getMany();
  }

  async deleteUser(uuid: string) {
    const res = await this.assetRepository.delete({ uuid });

    if (res.affected === 0)
      throw new BadRequestException(`Can't find user with id "${uuid}"`);
    return res.affected;
  }
}
