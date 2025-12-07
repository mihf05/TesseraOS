import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { ProjectsModule } from '../projects/projects.module';
import { TasksModule } from '../tasks/tasks.module';
import { MessagesModule } from '../messages/messages.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [ProjectsModule, TasksModule, MessagesModule, FilesModule],
  controllers: [PortalController],
})
export class PortalModule {}
