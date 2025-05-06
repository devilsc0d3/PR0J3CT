import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get members by user cuid in path
 * @param request
 * @param params
 */
export const GET: RequestHandler = async ({ params }) => {
    const { user_cuid } = params;

    try {
        const members = await prisma.members.findMany({
            where: {
                id_user: user_cuid,
            },
        });

        // get projects by id_projet
        const projects = await prisma.projects.findMany({
            where: {
                id: {
                    in: members.map((member) => member.id_projet),
                },
            },
        });
        return json({ message: "projects found", projects });
    } catch (error) {
        return json({ error: 'Error fetching members' }, { status: 500 });
    }
}

