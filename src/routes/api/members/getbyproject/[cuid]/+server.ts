import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get members by project cuid in path
 * @param request
 * @param params
 */

export const GET: RequestHandler = async ({ params }) => {
    const {project_cuid} = params;

    try {
        const members = await prisma.members.findMany({
            where: {
                id_projet: project_cuid,
            },
        });

        return json({message: "members found", members});
    } catch (error) {
        return json({error: 'Error fetching members'}, {status: 500});
    }
}