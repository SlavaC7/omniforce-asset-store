import {IsEnum, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {AbstractDto} from "../abstract.dto";
import {LangEnum} from "../../enum/lang.enum";

export class UserTranslateDto extends AbstractDto {
    @ApiProperty({
        description: "The user nickname",
        title: "Nickname",
        type: String,
        required: true,
        example: "Xepobopa"
    })
    @IsString()
    nickname: string;

    @ApiProperty({
        description: "The user description",
        title: "Description",
        type: String,
        required: true,
        example: "Description"
    })
    @IsString()
    desc: string;

    @ApiProperty({
        description: "Language name of the specific asset",
        title: "ru-RU, ua-UA, en-EN",
        type: String,
        required: true,
        example: "ru-RU"
    })
    @IsString()
    @IsEnum(LangEnum)
    language: LangEnum
}