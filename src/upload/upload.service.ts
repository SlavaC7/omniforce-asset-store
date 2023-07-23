import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Injectable()
export class UploadService {
    private readonly s3Client = new S3Client({
        region: this.configService.get<string>('AWS_REGION'),
        credentials: {
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
            secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        }
    })

    constructor(private readonly configService: ConfigService) {
    }

    async uploadUser(filename: string, file: Buffer) {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get<string>('AWS_USER_BUCKET'),
                Key: filename,
                Body: file,
            }),
        );
    }

    async uploadAsset(filename: string, file: Buffer) {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get<string>('AWS_ASSET_BUCKET'),
                Key: filename,
                Body: file,

            }),
        );
    }
}
