"use strict";
'use server';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserAction = createUserAction;
exports.updateUserAction = updateUserAction;
exports.deleteUserAction = deleteUserAction;
const zod_1 = require("zod");
const users_1 = require("../api/users");
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required.'),
    email: zod_1.z.string().email('Invalid email address.'),
    role: zod_1.z.enum(['Admin', 'Developer', 'Analyst']),
});
async function createUserAction(formData) {
    const validatedFields = UserSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        throw new Error('Invalid form data.');
    }
    await (0, users_1.createUser)(validatedFields.data);
    (0, cache_1.revalidatePath)('/users');
    (0, navigation_1.redirect)('/users');
}
const UpdateUserSchema = UserSchema.extend({
    id: zod_1.z.string(),
});
async function updateUserAction(formData) {
    const validatedFields = UpdateUserSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        throw new Error('Invalid form data for update.');
    }
    const { id, ...userData } = validatedFields.data;
    await (0, users_1.updateUser)(id, userData);
    (0, cache_1.revalidatePath)('/users');
    (0, cache_1.revalidatePath)(`/users/${id}/edit`);
    (0, navigation_1.redirect)('/users');
}
async function deleteUserAction(formData) {
    const id = formData.get('id');
    if (!id) {
        throw new Error('User ID is required for deletion.');
    }
    await (0, users_1.deleteUser)(id);
    (0, cache_1.revalidatePath)('/users');
}
//# sourceMappingURL=user.actions.js.map