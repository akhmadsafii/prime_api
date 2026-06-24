export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';
export interface Project {
    id: number;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}
export interface PaginatedProjectsResponse {
    data: Project[];
    total: number;
}
export declare function getProjects(params: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<PaginatedProjectsResponse>;
export declare function getProjectById(id: string): Promise<Project>;
export declare function createProject(projectData: {
    name: string;
    description?: string;
}): Promise<Project>;
export declare function updateProject(id: string, projectData: Partial<{
    name: string;
    description: string;
    status: ProjectStatus;
}>): Promise<Project>;
export declare function deleteProject(id: string): Promise<void>;
