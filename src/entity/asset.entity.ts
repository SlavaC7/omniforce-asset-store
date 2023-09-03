import {AbstractEntity} from "./abstarct.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {UserEntity} from "./user.entity";
import {UserTranslateEntity} from "./user-translate.entity";
import {AssetTranslateEntity} from "./asset-translate.entity";

@Entity({name: "asset"})
export class AssetEntity extends AbstractEntity {
    @Column('float8')
    public price: number;

    @Column('float8', {default: 0})
    public rating: number;

    @Column({default: 0})
    public likes: number;

    @Column({default: 0})
    public discount: number;

    @Column('simple-array', {nullable: true, default: []})
    public pictures: Array<string>;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    public user: UserEntity;

    @OneToMany(() => AssetTranslateEntity, (assetTranslate) => assetTranslate.asset, { cascade: true })
    public translations: AssetTranslateEntity[];
}