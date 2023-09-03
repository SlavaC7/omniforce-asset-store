import {AbstractEntity} from "./abstarct.entity";
import {Column, Entity, OneToMany} from "typeorm";
import {UserTranslateEntity} from "./user-translate.entity";

@Entity({name: "user"})
export class UserEntity extends AbstractEntity {

    @Column({nullable: true})
    public avatar: string;

    @Column()
    public auth0_sub: string;

    @OneToMany(() => UserTranslateEntity, (userTranslate) => userTranslate.user, {cascade: true})
    public translations: UserTranslateEntity[];
}