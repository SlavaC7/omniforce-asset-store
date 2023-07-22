import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";
import {ManagementClientService} from "../managementClient/management-client.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        private readonly managementClientService: ManagementClientService,
    ) {
    }

    async setAvatar(uuid: string, avatar: Buffer) {
        const res = await this.usersRepository.update(
            {uuid},
            {avatar}
        );

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }

    async create(newUser: CreateUserDto, auth0_sub: string) {
        return (await this.usersRepository.insert({...newUser, auth0_sub})).raw[0].uuid;
    }

    async getUser(uuid: string) {
        return await this.usersRepository.findOneByOrFail({uuid});
    }

    async deleteUser(uuid: string) {
        const res = await this.usersRepository.delete({uuid});

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${uuid}"`);
        return res.affected;
    }

    async blockUser(uuid: string) {
        const sub = (await this.getUser(uuid)).auth0_sub;
        return await this.managementClientService.managementClient.updateUser({id: sub}, {blocked: true});
    }
}



