'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createProject, updateProject, deleteProject } from '../api/projects';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
});

export async function createProjectAction(formData: FormData) {
  const validatedFields = ProjectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) throw new Error('Invalid form data.');

  await createProject(validatedFields.data);
  revalidatePath('/projects');
  redirect('/projects');
}

const UpdateProjectSchema = ProjectSchema.extend({
  id: z.string(),
  status: z.enum(['active', 'completed', 'on-hold', 'archived']),
});

export async function updateProjectAction(formData: FormData) {
  const validatedFields = UpdateProjectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) throw new Error('Invalid form data for update.');

  const { id, ...projectData } = validatedFields.data;
  await updateProject(id, projectData);

  revalidatePath('/projects');
  revalidatePath(`/projects/${id}/edit`);
  redirect('/projects');
}

export async function deleteProjectAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) throw new Error('Project ID is required.');

  await deleteProject(id);
  revalidatePath('/projects');
}