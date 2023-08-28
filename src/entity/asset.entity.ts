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

    @Column('float8', { default: 0 })
    rating: number;

    @Column({ default: 0 })
    likes: number;

    @Column({ default: 0 })
    discount: number;

    @Column('simple-array', {nullable: true, array: true, default: []})
    pictures: Array<string>;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    public user: UserEntity;
}