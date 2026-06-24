'use server';

import { z } from 'zod';
import { createUser, updateUser, deleteUser } from '../api/users';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  role: z.enum(['Admin', 'Developer', 'Analyst']),
});

export async function createUserAction(formData: FormData) {
  const validatedFields = UserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    throw new Error('Invalid form data.');
  }

  await createUser(validatedFields.data);

  revalidatePath('/users'); // Memberi tahu Next.js untuk memuat ulang data di halaman /users
  redirect('/users'); // Mengarahkan pengguna kembali ke daftar pengguna
}

const UpdateUserSchema = UserSchema.extend({
  id: z.string(),
});

export async function updateUserAction(formData: FormData) {
  const validatedFields = UpdateUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    throw new Error('Invalid form data for update.');
  }

  const { id, ...userData } = validatedFields.data;

  await updateUser(id, userData);

  revalidatePath('/users');
  revalidatePath(`/users/${id}/edit`);
  redirect('/users');
}

export async function deleteUserAction(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('User ID is required for deletion.');
  }

  await deleteUser(id);

  revalidatePath('/users');
}