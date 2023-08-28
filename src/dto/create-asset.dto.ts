import {PickType} from "@nestjs/swagger";
import {AssetDto} from "./asset.dto";

export class CreateAssetDto extends PickType(AssetDto, ['title', 'desc', 'price', 'discount', 'pictures'] as const) {
}