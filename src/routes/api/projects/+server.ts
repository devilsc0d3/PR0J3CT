import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
    const { title, description } = await request.json();
    const userId = "cm92uiucd0000mdv0folaa4la" as string;
    // const userId = request.headers.get('userId');
    try {
        const project = await prisma.projects.create({
            data: {
                title,
                description,
                userId,
            },
        });
        return json({ project }, { status: 201 });
    } catch (error) {
        return json({ error: 'Erreur lors de la création du projet' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    try {
        const projects = await prisma.projects.findMany();
        return json(projects);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des projets' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    const { id, title, description } = await request.json();

    try {
        const project = await prisma.projects.update({
            where: { id },
            data: {
                title,
                description,
            },
        });
        return json({ project });
    } catch (error) {
        return json({ error: 'Erreur lors de la mise à jour du projet' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();

    try {
        await prisma.projects.delete({
            where: { id },
        });
        return json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        return json({ error: 'Erreur lors de la suppression du projet' }, { status: 500 });
    }
};
