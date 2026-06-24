import type { Project } from '@/lib/api/projects';
interface ProjectsTableProps {
    projects: Project[];
    totalProjects: number;
    currentPage: number;
    limit: number;
}
export default function ProjectsTable({ projects, totalProjects, currentPage, limit }: ProjectsTableProps): any;
export {};
