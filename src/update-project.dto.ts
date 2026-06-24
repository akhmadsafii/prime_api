import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsEnum(['active', 'completed', 'on-hold', 'archived'])
  @IsOptional()
  status?: ProjectStatus;
}