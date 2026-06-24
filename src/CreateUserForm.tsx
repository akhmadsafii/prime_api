'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createUserAction } from '@/lib/actions/user.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {pending ? 'Creating...' : 'Create User'}
    </button>
  );
}

export default function CreateUserForm() {
  // `useFormState` bisa digunakan untuk menangani error, untuk saat ini kita gunakan null.
  const [errorMessage, dispatch] = useFormState(createUserAction, undefined);

  return (
    <form action={dispatch} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select name="role" id="role" defaultValue="Developer" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
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