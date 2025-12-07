import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
      endpoint: this.configService.get('AWS_ENDPOINT'), // For MinIO
      forcePathStyle: true, // Required for MinIO
    });
    this.bucketName = this.configService.get('AWS_BUCKET_NAME') || 'tesseraos';
  }

  async upload(
    file: Express.Multer.File,
    projectId: string,
    userId: string,
  ) {
    const key = `${projectId}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    // Generate signed URL
    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });

    return this.prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        key,
        url,
        projectId,
        uploadedById: userId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.file.findMany({
      where: { projectId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async getSignedUrl(id: string) {
    const file = await this.findOne(id);

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: file.key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async remove(id: string) {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Delete from S3
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: file.key,
      });
      await this.s3Client.send(command);

      // Delete from database
      await this.prisma.file.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
