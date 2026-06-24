"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectAction = createProjectAction;
exports.updateProjectAction = updateProjectAction;
exports.deleteProjectAction = deleteProjectAction;
const zod_1 = require("zod");
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const projects_1 = require("../api/projects");
const ProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required.'),
    description: zod_1.z.string().optional(),
});
async function createProjectAction(formData) {
    const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success)
        throw new Error('Invalid form data.');
    await (0, projects_1.createProject)(validatedFields.data);
    (0, cache_1.revalidatePath)('/projects');
    (0, navigation_1.redirect)('/projects');
}
const UpdateProjectSchema = ProjectSchema.extend({
    id: zod_1.z.string(),
    status: zod_1.z.enum(['active', 'completed', 'on-hold', 'archived']),
});
async function updateProjectAction(formData) {
    const validatedFields = UpdateProjectSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success)
        throw new Error('Invalid form data for update.');
    const { id, ...projectData } = validatedFields.data;
    await (0, projects_1.updateProject)(id, projectData);
    (0, cache_1.revalidatePath)('/projects');
    (0, cache_1.revalidatePath)(`/projects/${id}/edit`);
    (0, navigation_1.redirect)('/projects');
}
async function deleteProjectAction(formData) {
    const id = formData.get('id');
    if (!id)
        throw new Error('Project ID is required.');
    await (0, projects_1.deleteProject)(id);
    (0, cache_1.revalidatePath)('/projects');
}
//# sourceMappingURL=project.actions.js.map