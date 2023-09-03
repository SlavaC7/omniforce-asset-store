import {AbstractEntity} from "./abstarct.entity";
import {Column, Entity, ManyToOne} from "typeorm";
import {LangEnum} from "../enum/lang.enum";
import {UserEntity} from "./user.entity";

@Entity({name: "userTranslate"})
export class UserTranslateEntity extends AbstractEntity {
    @Column()
    public nickname: string;

    @Column()
    public desc: string;

    @Column({enum: LangEnum, length: 5})
    public language: LangEnum;

    @ManyToOne(() => UserEntity, (user) => user.translations)
    public user: UserEntity;
}