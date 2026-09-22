import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageSectionsService } from './page-sections.service.js';
import { PageSectionsController } from './page-sections.controller.js';
import { PageSection } from './entities/page-section.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PageSection]), AuthModule],
  controllers: [PageSectionsController],
  providers: [PageSectionsService],
  exports: [PageSectionsService],
})
export class PageSectionsModule {}
