import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
    const { name, projectId } = await request.json();

    try {
        const column = await prisma.column.create({
            data: {
                name,
                projectId,
            },
        });
        return json({ column }, { status: 201 });
    } catch (error) {
        return json({ error: 'Erreur lors de la création de la colonne' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    try {
        const columns = await prisma.column.findMany();
        return json(columns);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des colonnes' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    const { id, name } = await request.json();

    try {
        const column = await prisma.column.update({
            where: { id },
            data: {
                name,
            },
        });
        return json({ column });
    } catch (error) {
        return json({ error: 'Erreur lors de la mise à jour de la colonne' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();

    try {
        await prisma.column.delete({
            where: { id },
        });
        return json({ message: 'Colonne supprimée avec succès' });
    } catch (error) {
        return json({ error: 'Erreur lors de la suppression de la colonne' }, { status: 500 });
    }
};

