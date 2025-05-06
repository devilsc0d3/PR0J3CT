import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description get favorites with user and project
 * @param request
 * @param params
 * @returns {Promise<{status: number, body: {error: string}}|{status: number, body: {project: any}}>}
 */
export const POST = async ({ request }) => {
    const {id_user, id_project} = await request.json();
    try {
        const favorite = await prisma.favorites.findFirst({
            where: {
                id_user,
                id_project
            },
        });

        if (!favorite) {
            return json({error: 'Favorite not found'}, {status: 404});
        }
        return json(favorite);
    } catch (error) {
        console.log(error);
        return json({error: 'Error fetching favorites'}, {status: 500});
    }
}