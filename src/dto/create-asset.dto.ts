import {OmitType} from "@nestjs/swagger";
import {AssetDto} from "./asset.dto";

export class CreateAssetDto extends OmitType(AssetDto, ['userId', 'pictures', 'uuid', 'updatedAt', 'createdAt', 'id', 'pictures'] as const) {
}