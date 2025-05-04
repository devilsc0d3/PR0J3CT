import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description create a new member
 * @param request
 * @param params
 */
export const POST: RequestHandler = async ({ request }) => {
    const { id_user, id_projet, role, email} = await request.json();

    try {
        const member = await prisma.members.create({
            data: {
                role,
                email,
                id_user,
                id_projet,
            },
        });
        return json({ member }, { status: 201 });
    } catch (error) {
        return json({ error: 'Error creating member' }, { status: 500 });
    }
}