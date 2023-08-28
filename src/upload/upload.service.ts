import {ConsoleLogger, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import * as AWS from "aws-sdk";

@Injectable()
export class UploadService {
    private s3Client: AWS.S3;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new AWS.S3({
            endpoint: this.configService.get<string>('AWS_HOST'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            }
        });
    }

    async uploadUser(filename: string, file: Buffer) {
        const res = await this.s3Client.upload(
            {
                Bucket: "omniforce-asset-store-user",
                Body: file,
                Key: filename,
            }
        )
        res.send((err, data) => console.log(`Error: ${err}\n\nData: ${{...data}}`));
        return `http://${this.configService.get<string>('AWS_HOST')}/${this.configService.get<string>('AWS_USER_BUCKET')}/${filename}`;
    }

    async uploadAsset(filename: string, file: Buffer) {
        await this.s3Client.upload(
            {
                Bucket: "omniforce-asset-store-asset",
                Body: file,
                Key: filename,
            }
        )
        return `http://${this.configService.get<string>('AWS_HOST')}/${this.configService.get<string>('AWS_ASSET_BUCKET')}/${filename}`;
    }
}
