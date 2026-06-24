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

const BASE_URL = `${process.env.API_INTERNAL_URL || 'http://next-api:3001'}/projects`;

export async function getProjects(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedProjectsResponse> {
  const url = new URL(BASE_URL);
  if (params.page) url.searchParams.set('page', params.page.toString());
  if (params.limit) url.searchParams.set('limit', params.limit.toString());
  if (params.search) url.searchParams.set('search', params.search);

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  } catch (error) {
    console.error('API Error getProjects:', error);
    return { data: [], total: 0 };
  }
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
}

export async function createProject(projectData: {
  name: string;
  description?: string;
}): Promise<Project> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export async function updateProject(
  id: string,
  projectData: Partial<{ name: string; description: string; status: ProjectStatus }>,
): Promise<Project> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete project');
}