import {IntersectionType, PartialType} from "@nestjs/swagger";
import {UserTranslateDto} from "./user-translate.dto";
import {UserDto} from "./user.dto";

class Translate {
    translations: UserTranslateDto[];
}

export class UpdateUserDto extends PartialType(IntersectionType(UserDto, Translate)) {}