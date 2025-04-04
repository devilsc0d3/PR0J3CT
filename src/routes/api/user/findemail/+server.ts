import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
    const { email } = await request.json();

    try {
        // Vérifier si l'email existe déjà dans la base de données
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (user) {
            return json({ message: 'Email already exists' }, { status: 400 });
        }

        return json({ message: 'Email is available' });
    } catch (error) {
        return json({ error: 'Error checking email availability' }, { status: 500 });
    }
};