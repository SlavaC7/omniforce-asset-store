import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: "The nickname of a user",
        title: "User nickname",
        type: String,
        required: true,
        example: "Xepobopa"
    })
    @IsString()
    nickname: string;

    @ApiProperty({
        description: "The description of a user",
        title: "User description",
        type: String,
        required: true,
        example: "hryak + vulkan41k = love"
    })
    @IsString()
    desc: string;
}
