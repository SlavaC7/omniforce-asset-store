import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
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
}
