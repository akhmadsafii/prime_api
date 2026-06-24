'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateUserAction } from '@/lib/actions/user.actions';
import type { User } from '@/lib/api/users';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {pending ? 'Updating...' : 'Update User'}
    </button>
  );
}

export default function EditUserForm({ user }: { user: User }) {
  const [errorMessage, dispatch] = useFormState(updateUserAction, undefined);

  return (
    <form action={dispatch} className="space-y-4 max-w-lg">
      <input type="hidden" name="id" value={user.id} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" required defaultValue={user.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" required defaultValue={user.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select name="role" id="role" defaultValue={user.role} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option>Admin</option>
          <option>Developer</option>
          <option>Analyst</option>
        </select>
      </div>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}