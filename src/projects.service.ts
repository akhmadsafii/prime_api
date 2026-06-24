import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(newProject);
  }

  async findAll(
    page = 1,
    limit = 10,
    search = '',
  ): Promise<{ data: Project[]; total: number }> {
    const [data, total] = await this.projectsRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectsRepository.preload({
      id: id,
      ...updateProjectDto,
    });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }
}