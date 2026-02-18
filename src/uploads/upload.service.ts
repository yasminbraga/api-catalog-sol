import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly bucketName: 'catalog-sol';
  private s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('CLOUDFLARE_REGION'),
      endpoint: this.configService.get('CLOUDFLARE_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('CLOUDFLARE_KEY_ID') || '',
        secretAccessKey: this.configService.get('CLOUDFLARE_KEY_SECRET') || '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const key = `${uuidv4()}-${file.originalname}`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        }),
      );
      const publicUrl = this.getPublicUrl(key);

      return { publicUrl, key };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao fazer upload da imagem');
    }
  }

  private getPublicUrl(key: string) {
    const s3PublicUrl: string =
      this.configService.get('CLOUDFLARE_PUBLIC_URL') || '';
    return `${s3PublicUrl}/${key}`;
  }
}
