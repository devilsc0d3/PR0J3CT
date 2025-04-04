// src/routes/api/+server.ts

import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
    const { email, password } = await request.json();

    try {
        const user = await prisma.users.create({
            data: {
                email,
                password,  // Pense à hasher le mot de passe avant de l'enregistrer !
            },
        });
        return json({ user }, { status: 201 });
    } catch (error) {
        return json({ error: 'Erreur lors de la création de l\'utilisateur' }, { status: 500 });
    }
};

export const GET: RequestHandler = async () => {
    try {
        const users = await prisma.users.findMany();
        return json(users);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des utilisateurs' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    const { id, email, password } = await request.json();

    try {
        const user = await prisma.users.update({
            where: { id },
            data: {
                email,
                password,  // Pense à hasher le mot de passe avant de l'enregistrer !
            },
        });
        return json({ user });
    } catch (error) {
        return json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();

    try {
        await prisma.users.delete({
            where: { id },
        });
        return json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        return json({ error: 'Erreur lors de la suppression de l\'utilisateur' }, { status: 500 });
    }
};
