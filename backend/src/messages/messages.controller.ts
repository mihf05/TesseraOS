import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('projects/:projectId/messages')
  create(
    @Param('projectId') projectId: string,
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(projectId, req.user.userId, createMessageDto);
  }

  @Get('projects/:projectId/messages')
  findByProject(@Param('projectId') projectId: string) {
    return this.messagesService.findByProject(projectId);
  }

  @Get('messages/:id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Delete('messages/:id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
