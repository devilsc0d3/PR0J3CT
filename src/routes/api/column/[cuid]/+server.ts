import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }) => {
    try {
        const { cuid } = params;
        const columns = await prisma.column.findMany({
            where: { projectId: cuid },
        });

        return json(columns);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des colonnes' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { cuid } = params;
        const column = await prisma.column.delete({
            where: { id: cuid },
        });

        return json(column);
    } catch (error) {
        return json({ error: 'Erreur lors de la suppression de la colonne' }, { status: 500 });
    }
}

export const PUT : RequestHandler = async ({ request, params}) => {

    const { name } = await request.json();
    if (!name.trim()) return json({ error: 'Le nom de la colonne ne peut pas être vide' }, { status: 400 });

    try {
        const column = await prisma.column.update({
            where: { id: params.cuid },
            data: {
                name,
            },
        });
        return json({ column });
    } catch (error) {
        return json({ error: 'Erreur lors de la mise à jour de la colonne' }, { status: 500 });
    }
}