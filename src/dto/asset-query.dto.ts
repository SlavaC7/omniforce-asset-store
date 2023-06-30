import {PartialType, PickType} from "@nestjs/swagger";
import {AssetDto} from "./asset.dto";

export class AssetQueryDto extends PartialType(PickType(AssetDto, ['likes', 'price', 'rating', 'title', 'userId'] as const)) {}