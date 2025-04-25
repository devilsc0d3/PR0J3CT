import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get project by id on path /api/projects/[cuid]
 * @param request
 * @constructor
 */
export const GET: RequestHandler = async ({ params }) => {
    const { cuid } = params;

    try {
        const project = await prisma.projects.findUnique({
            where: { id: cuid },
        });
        if (!project) {
            return json({ error: 'Project not found' }, { status: 404 });
        }
        return json(project);
    } catch (error) {
        return json({ error: 'Error fetching project' }, { status: 500 });
    }
}