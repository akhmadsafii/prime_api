import { getProjects } from '@/lib/api/projects';
import ProjectsTable from '@/components/projects/ProjectsTable';

interface ProjectsPageProps {
  searchParams: { page?: string; search?: string; };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const limit = 10;

  const { data: projects, total } = await getProjects({ page, limit, search });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>
      <ProjectsTable projects={projects} totalProjects={total} currentPage={page} limit={limit} />
    </div>
  );
}