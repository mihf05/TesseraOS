import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { ClientsModule } from '../clients/clients.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ClientsModule, ProjectsModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
