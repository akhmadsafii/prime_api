"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
async function getUsers(params) {
    const url = new URL(`${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users`);
    if (params.page)
        url.searchParams.set('page', params.page.toString());
    if (params.limit)
        url.searchParams.set('limit', params.limit.toString());
    if (params.search)
        url.searchParams.set('search', params.search);
    try {
        const response = await fetch(url.toString(), { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        return response.json();
    }
    catch (error) {
        console.error('API call failed:', error);
        return { data: [], total: 0 };
    }
}
async function createUser(userData) {
    const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
    }
    return response.json();
}
async function getUserById(id) {
    const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
}
async function updateUser(id, userData) {
    const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;
    const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update user: ${response.statusText} - ${errorBody}`);
    }
    return response.json();
}
async function deleteUser(id) {
    const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;
    const response = await fetch(apiUrl, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
    }
}
//# sourceMappingURL=users.js.map