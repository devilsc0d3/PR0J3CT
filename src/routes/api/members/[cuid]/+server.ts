import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * @description delete a member
 * @param request
 * @param params
 */
export const DELETE: RequestHandler = async ({ params }) => {
    const {cuid} = params;

    try {
        const member = await prisma.members.delete({
            where: {
                id: cuid,
            },
        });
        return json({message: "member deleted", member});
    } catch (error) {
        return json({error: 'Error deleting member'}, {status: 500});
    }
}