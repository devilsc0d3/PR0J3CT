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

        if (!columns || columns.length === 0) {
            return json({ error: 'Aucune colonne trouvée' }, { status: 404 });
        }

        return json(columns);
    } catch (error) {
        return json({ error: 'Erreur lors de la récupération des colonnes' }, { status: 500 });
    }
};
