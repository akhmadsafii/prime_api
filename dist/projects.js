"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
const BASE_URL = `${process.env.API_INTERNAL_URL || 'http://next-api:3001'}/projects`;
async function getProjects(params) {
    const url = new URL(BASE_URL);
    if (params.page)
        url.searchParams.set('page', params.page.toString());
    if (params.limit)
        url.searchParams.set('limit', params.limit.toString());
    if (params.search)
        url.searchParams.set('search', params.search);
    try {
        const response = await fetch(url.toString(), { cache: 'no-store' });
        if (!response.ok)
            throw new Error('Failed to fetch projects');
        return response.json();
    }
    catch (error) {
        console.error('API Error getProjects:', error);
        return { data: [], total: 0 };
    }
}
async function getProjectById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
    if (!response.ok)
        throw new Error('Failed to fetch project');
    return response.json();
}
async function createProject(projectData) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
    });
    if (!response.ok)
        throw new Error('Failed to create project');
    return response.json();
}
async function updateProject(id, projectData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
    });
    if (!response.ok)
        throw new Error('Failed to update project');
    return response.json();
}
async function deleteProject(id) {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok)
        throw new Error('Failed to delete project');
}
//# sourceMappingURL=projects.js.map