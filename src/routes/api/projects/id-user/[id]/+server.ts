import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get project by id on path /api/projects/[id-user]
 * @param request
 * @constructor
 */
export const GET: RequestHandler = async ({ params }) => {
    const {id} = params;

    try {
        const project = await prisma.projects.findMany({
            where: {userId: id},
        });
        if (!project) {
            return json({error: 'Project not found'}, {status: 404});
        }
        return json(project);
    } catch (error) {
        return json({error: 'Error fetching project'}, {status: 500});
    }
}

/**
 * @description create project on path /api/projects/[id-user]
 * @param request
 * @param params
 * @returns
 *
 */
export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const { title, description, background } = await request.json();
        const { id } = params;

        if (!id) {
            return json({ error: 'User ID is required' }, { status: 400 });
        }

        const project = await prisma.projects.create({
            data: {
                title,
                description,
                background,
                userId: id,
            },
        });
        return json(project);
    } catch (error) {
        return json({ error: 'Error creating project' }, { status: 500 });
    }
};