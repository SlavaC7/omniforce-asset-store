import {AbstractEntity} from "./abstarct.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity({name: "asset"})
export class AssetEntity extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    desc: string;

    @Column('float8')
    price: number;

    @Column('float8')
    rating: number;

    @Column()
    likes: number;

    @Column('simple-array', {nullable: true, array: true})
    pictures: Array<string>;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    public user: UserEntity;
}