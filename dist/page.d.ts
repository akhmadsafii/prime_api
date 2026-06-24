interface ProjectsPageProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}
export default function ProjectsPage({ searchParams }: ProjectsPageProps): Promise<any>;
export {};
