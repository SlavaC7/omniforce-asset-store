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

    async setAvatar(id: number, avatar: Buffer) {
        const res = await this.usersRepository.update(
            id,
            {avatar}
        );

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${id}"`);
        return res.affected;
    }

    async create(newUser: CreateUserDto, auth0_sub: string) {
        return (await this.usersRepository.insert({...newUser, auth0_sub})).identifiers[0].id;
    }

    async getUser(id: number) {
        return await this.usersRepository.findOneByOrFail({id});
    }

    async deleteUser(id: number) {
        const res = await this.usersRepository.delete(id);

        if (res.affected === 0) throw new BadRequestException(`Can't find user with id "${id}"`);
        return res.affected;
    }
}
