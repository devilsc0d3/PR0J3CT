import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get all favorites
 * @param request
 * @param params
 * @returns {Promise<{status: number, body: {error: string}}|{status: number, body: {project: any}}>}
 */
export const GET: RequestHandler = async () => {
    try {
        const favorites = await prisma.favorites.findMany();
        return json(favorites);
    } catch (error) {
        return json({ error: 'Error fetching favorites' }, { status: 500 });
    }
}

/**
 * @description get add favorite
 * @param request
 * @param params
 * @returns {Promise<{status: number, body: {error: string}}|{status: number, body: {project: any}}>}
 */
export const POST: RequestHandler = async ({ request }) => {
    const { id_user, id_project } = await request.json();

    try {
        const favorite = await prisma.favorites.create({
            data: {
                id_user,
                id_project,
            },
        });
        return json({ favorite }, { status: 201 });
    } catch (error) {
        return json({ error: 'Error creating favorite' }, { status: 500 });
    }
}

/**
 * @description delete favorite
 * @param request
 * @returns {Promise<{status: number, body: {error: string}}|{status: number, body: {project: any}}>}
*/
export const DELETE: RequestHandler = async ({ request }) => {
    const {id_user, id_project} = await request.json();
    try {
        const favorite = await prisma.favorites.delete({
            where: {
                id_user,
                id_project
            },
        });
        return json(favorite);
    } catch (error) {
        console.log(error);
        return json({error: 'Error deleting favorite'}, {status: 500});
    }
}