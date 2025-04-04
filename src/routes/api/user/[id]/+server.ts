// src/routes/api/user/[id]/+server.ts
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params;

    console.log(id)
    try {
        const user = await prisma.users.findUnique({
            where: { id },
        });

        if (!user) {
            return json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return json(user);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération de l\'utilisateur' }, { status: 500 });
    }
}