import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(@Param('projectId') projectId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(projectId, createTaskDto);
  }

  @Get('projects/:projectId/tasks')
  findByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Get('tasks/:id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
