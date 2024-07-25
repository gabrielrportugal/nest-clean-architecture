import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

// CLOUDFARE uses the same SDK as Aws

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFARE_ACCOUNT_ID')
    const accessKeyId = envService.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = envService.get('AWS_SECRET_ACCESS_KEY_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  public async upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()

    const uniqueFileName = `${uploadId}-${fileName}`

    const bucketName = this.envService.get('AWS_BUCKET_NAME')

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
