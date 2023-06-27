import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";
import {AbstractDto} from "./abstract.dto";

export class UserDto extends AbstractDto {
    @ApiProperty({
        description: "User id contains in auth0 database",
        title: "User auth0 ID",
        type: String,
        required: true,
        example: "google-oauth2|102336369590118977236"
    })
    auth0_sub: string;

    @ApiProperty({
        description: "The user avatar",
        title: "Avatar",
        type: typeof {
            type: String,
            data: [Number]
        },
        example: {
            type: "Buffer",
            data: [234, 23, 4, 453, 65, 234]
        }
    })
    @IsNumber()
    public avatar: {
        type: String,
        data: [Number]
    };

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
