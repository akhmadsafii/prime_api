"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UsersTable;
const navigation_1 = require("next/navigation");
const react_dom_1 = require("react-dom");
const link_1 = require("next/link");
const use_debounce_1 = require("use-debounce");
const user_actions_1 = require("@/lib/actions/user.actions");
const StatusBadge = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    const statusClasses = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        banned: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};
function DeleteUserButton({ userId }) {
    const { pending } = (0, react_dom_1.useFormStatus)();
    const handleClick = (e) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            e.preventDefault();
        }
    };
    return (<button type="submit" onClick={handleClick} disabled={pending} className="text-red-600 hover:text-red-900 disabled:text-gray-400">
      {pending ? 'Deleting...' : 'Delete'}
    </button>);
}
function UsersTable({ users, totalUsers, currentPage, limit }) {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const handleSearch = (0, use_debounce_1.useDebouncedCallback)((term) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        }
        else {
            params.delete('search');
        }
        params.set('page', '1');
        router.replace(`/users?${params.toString()}`);
    }, 300);
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/users?${params.toString()}`);
    };
    const totalPages = Math.ceil(totalUsers / limit);
    return (<div>
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by name or email..." className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md" onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('search') || ''}/>
        <link_1.default href="/users/new">
          <span className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Add User
          </span>
        </link_1.default>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (<tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500 ml-4">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status}/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-4">
                    <link_1.default href={`/users/${user.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </link_1.default>
                    <form action={user_actions_1.deleteUserAction}>
                      <input type="hidden" name="id" value={user.id}/>
                      <DeleteUserButton userId={user.id}/>
                    </form>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> results
        </p>
        <div className="flex gap-2">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>);
}
div >
;
;
//# sourceMappingURL=UsersTable.js.map