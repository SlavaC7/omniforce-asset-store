import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/user/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {ManagementClientService} from "../managementClient/management-client.service";
import {UploadService} from "../upload/upload.service";
import {UpdateUserDto} from "../dto/user/update-user.dto";
import {UserTranslateEntity} from "../entity/user-translate.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        @InjectRepository(UserTranslateEntity) private userTranslateRepository: Repository<UserTranslateEntity>,
        private readonly managementClientService: ManagementClientService,
        private readonly uploadService: UploadService
    ) {
    }

    async setAvatar(uuid: string, filename: string, avatar: Buffer) {
        const file = await this.uploadService.uploadUser(filename, avatar);

        const res = await this.usersRepository.update(
            {uuid},
            {avatar: file}
        );

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }

    async create(newUser: CreateUserDto, auth0_sub: string) {
        const userTrans: UserTranslateEntity[] =
            newUser.lang.map(value => {
                const newUserTrans = new UserTranslateEntity();
                newUserTrans.language = value.language;
                newUserTrans.nickname = value.nickname;
                newUserTrans.desc = value.desc;
                return newUserTrans;
            });
        const user = new UserEntity();
        user.auth0_sub = auth0_sub;
        user.translations = userTrans;
        return (await this.usersRepository.save(user)).uuid;
    }

    async updateUser(uuid: string, changes: UpdateUserDto) {
        const userToUpdate = await this.getUserByUuid(uuid);
        console.log(userToUpdate)
        console.log(Object.assign(userToUpdate, changes));
        return await this.usersRepository.save(Object.assign(userToUpdate, changes));
    }

    async getUserByUuid(uuid: string) {
        return await this.usersRepository.findOneOrFail({ where: { uuid }, relations: ['translations'] });
    }

    async getUserBySub(sub: string) {
        return await this.usersRepository.findOneOrFail({ where: { auth0_sub: sub }, relations: ['translations'] });
    }

    async deleteUser(uuid: string) {
        const res = await this.usersRepository.delete({uuid});

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }

    async blockUser(uuid: string) {
        const sub = (await this.getUserByUuid(uuid)).auth0_sub;
        return await this.managementClientService.managementClient.updateUser({id: sub}, {blocked: true});
    }
}



