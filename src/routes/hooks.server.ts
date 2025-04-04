import {Connect} from "vite";
// import NextFunction = Connect.NextFunction;
//
// const handleDebugJWT = (req: Request, res: Response, next: NextFunction) => {
//     if (req.headers.authorization) {
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.decode(token);
//         console.log(decoded);
//     }
//     next();
// }
// src/hooks.server.ts
// src/hooks.server.ts

import { parse } from 'cookie';
import { PrismaClient } from '@prisma/client';
import { decodeJwt } from '$lib/auth';  // Si tu utilises JWT pour l'authentification
import { getUserFromToken } from '$lib/auth';  // Si tu veux extraire l'utilisateur d'un token

const prisma = new PrismaClient();

export async function handle({ event, resolve }) {
    const cookies = parse(event.request.headers.get('cookie') || '');
    const token = cookies['auth_token'];  // Exemple avec un cookie 'auth_token'

    if (token) {
        try {
            // Ici tu pourrais décoder un JWT, par exemple
            const user = await getUserFromToken(token);

            // Si l'utilisateur est authentifié, on l'ajoute à `event.locals`
            event.locals.user = user;
        } catch (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        }
    }

    // Résoudre la requête et retourner la réponse
    const response = await resolve(event);
    return response;
}

// Exemple de fonction pour décoder un token JWT et récupérer l'utilisateur
async function getUserFromToken(token: string) {
    // Décodage du token (ici tu devrais utiliser une bibliothèque comme 'jsonwebtoken')
    const decoded = decodeJwt(token);

    // Recherche l'utilisateur dans la base de données
    return await prisma.users.findUnique({
        where: { id: decoded.userId }
    });
}
