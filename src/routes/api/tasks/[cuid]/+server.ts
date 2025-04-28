import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }) => {
    try {
        const { cuid } = params;
        const column = await prisma.tasks.findUnique({
            where: { id: cuid },
        });

        if (!column) {
            return json({ error: 'Aucune colonne trouvée' }, { status: 404 });
        }

        return json(column);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération de la colonne' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    const { id, title, content, columnId } = await request.json();

    try {
        const task = await prisma.tasks.update({
            where: { id },
            data: {
                title,
                content,
                columnId,
            },
        });
        return json({ task });
    } catch (error) {
        return json({ error: 'Erreur lors de la mise à jour de la tâche' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { cuid } = params;
        const column = await prisma.tasks.delete({
            where: { id: cuid },
        });

        return json(column);
    } catch (error) {
        console.log(error);
        return json({ error: 'Erreur lors de la suppression de la colonne' }, { status: 500 });
    }
};
