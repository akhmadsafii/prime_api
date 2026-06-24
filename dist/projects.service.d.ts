import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: Project[];
        total: number;
    }>;
    findOne(id: number): Promise<Project>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: number): Promise<void>;
}
