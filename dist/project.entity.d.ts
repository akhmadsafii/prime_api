export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'archived';
export declare class Project {
    id: number;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
}
