export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Developer' | 'Analyst';
  status: 'active' | 'pending' | 'banned';
  lastLogin: string;
  avatarUrl?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
}

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedUsersResponse> {
  const url = new URL(`${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users`);
  if (params.page) url.searchParams.set('page', params.page.toString());
  if (params.limit) url.searchParams.set('limit', params.limit.toString());
  if (params.search) url.searchParams.set('search', params.search);

  try {
    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    return { data: [], total: 0 };
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  role: User['role'];
}): Promise<User> {
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

export async function getUserById(id: string): Promise<User> {
  const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;
  const response = await fetch(apiUrl, { cache: 'no-store' });

  if (!response.ok) {
    // Ini akan ditangkap oleh `notFound()` di Next.js jika statusnya 404
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  return response.json();
}

export async function updateUser(
  id: string,
  userData: Partial<{
    name: string;
    email: string;
    role: User['role'];
  }>,
): Promise<User> {
  const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;

  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    // Di sini kita bisa menangani error lebih spesifik jika perlu
    const errorBody = await response.text();
    throw new Error(`Failed to update user: ${response.statusText} - ${errorBody}`);
  }
  return response.json();
}

export async function deleteUser(id: string): Promise<void> {
  const apiUrl = `${process.env.API_INTERNAL_URL || 'http://localhost:3001'}/v1/users/${id}`;

  const response = await fetch(apiUrl, {
    method: 'DELETE',
  });

  if (!response.ok) {
    // 204 No Content is a success status, so we only check for other statuses.
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }
  // No body is returned on 204, so we don't call .json()
}