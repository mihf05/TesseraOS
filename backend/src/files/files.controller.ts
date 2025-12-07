import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('projects/:projectId/files')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.filesService.upload(file, projectId, req.user.userId);
  }

  @Get('projects/:projectId/files')
  findByProject(@Param('projectId') projectId: string) {
    return this.filesService.findByProject(projectId);
  }

  @Get('files/:id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get('files/:id/download')
  getSignedUrl(@Param('id') id: string) {
    return this.filesService.getSignedUrl(id);
  }

  @Delete('files/:id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
