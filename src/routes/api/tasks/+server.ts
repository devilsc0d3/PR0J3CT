import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
    const { title, content, columnId } = await request.json();

    try {
        const task = await prisma.tasks.create({
            data: {
                title,
                content,
                columnId,
            },
        });
        return json({ task }, { status: 201 });
    } catch (error) {
        return json({ error: 'Erreur lors de la création de la tâche' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    try {
        const tasks = await prisma.tasks.findMany();
        return json(tasks);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des tâches' }, { status: 500 });
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

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();

    try {
        await prisma.tasks.delete({
            where: { id },
        });
        return json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        return json({ error: 'Erreur lors de la suppression de la tâche' }, { status: 500 });
    }
};

