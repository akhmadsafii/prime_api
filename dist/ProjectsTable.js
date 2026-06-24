"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjectsTable;
const navigation_1 = require("next/navigation");
const react_dom_1 = require("react-dom");
const link_1 = require("next/link");
const use_debounce_1 = require("use-debounce");
const project_actions_1 = require("@/lib/actions/project.actions");
const StatusBadge = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full capitalize';
    const statusClasses = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        'on-hold': 'bg-yellow-100 text-yellow-800',
        archived: 'bg-gray-100 text-gray-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status.replace('-', ' ')}</span>;
};
function DeleteProjectButton({ projectId }) {
    const { pending } = (0, react_dom_1.useFormStatus)();
    const handleClick = (e) => {
        if (!confirm('Are you sure you want to delete this project?')) {
            e.preventDefault();
        }
    };
    return (<button type="submit" onClick={handleClick} disabled={pending} className="text-red-600 hover:text-red-900 disabled:text-gray-400">
      {pending ? 'Deleting...' : 'Delete'}
    </button>);
}
function ProjectsTable({ projects, totalProjects, currentPage, limit }) {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const handleSearch = (0, use_debounce_1.useDebouncedCallback)((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('search', term);
        }
        else {
            params.delete('search');
        }
        router.replace(`/projects?${params.toString()}`);
    }, 300);
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/projects?${params.toString()}`);
    };
    const totalPages = Math.ceil(totalProjects / limit);
    return (<div>
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search by project name..." className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md" onChange={(e) => handleSearch(e.target.value)} defaultValue={searchParams.get('search') || ''}/>
        <link_1.default href="/projects/new" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 whitespace-nowrap">
          Add Project
        </link_1.default>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (<tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={project.status}/></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-4">
                    <link_1.default href={`/projects/${project.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</link_1.default>
                    <form action={project_actions_1.deleteProjectAction}><input type="hidden" name="id" value={project.id}/><DeleteProjectButton projectId={project.id}/></form>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      
    </div>);
}
//# sourceMappingURL=ProjectsTable.js.map