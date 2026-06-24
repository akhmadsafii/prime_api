"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjectsPage;
const projects_1 = require("@/lib/api/projects");
const ProjectsTable_1 = require("@/components/projects/ProjectsTable");
async function ProjectsPage({ searchParams }) {
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';
    const limit = 10;
    const { data: projects, total } = await (0, projects_1.getProjects)({ page, limit, search });
    return (<div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>
      <ProjectsTable_1.default projects={projects} totalProjects={total} currentPage={page} limit={limit}/>
    </div>);
}
//# sourceMappingURL=page.js.map