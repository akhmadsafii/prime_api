import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(page: number, limit: number, search: string): Promise<{
        data: CreateProjectDto[];
        total: number;
    }>;
    findOne(id: number): Promise<Project>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: number): Promise<void>;
}
