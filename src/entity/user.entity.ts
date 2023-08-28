import {AbstractEntity} from "./abstarct.entity";
import {Column, Entity} from "typeorm";

@Entity({name: "users"})
export class UserEntity extends AbstractEntity {
    @Column()
    public nickname: string;

    @Column({nullable: true})
    public avatar: string;

    @Column()
    public auth0_sub: string;

    @Column()
    public desc: string;
}