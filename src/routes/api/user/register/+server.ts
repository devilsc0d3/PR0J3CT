import {json} from '@sveltejs/kit';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * POST /api/user/register
 * @param request
 * @returns {Promise<Response>}
 */
export async function POST({request}) {
    try {
        const {email, password} = await request.json();

        // check payload
        if (!email || !password) {
            return json({error: 'Email et mot de passe requis.'}, {status: 400});
        }

        // check already existing user
        const existingUser = await prisma.users.findUnique({where: {email}});
        if (existingUser) {
            return json({error: 'Utilisateur déjà existant.'}, {status: 400});
        }

        // create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        return json({message: 'Utilisateur créé avec succès.', user: {id: user.id, email: user.email}});
    } catch (error) {
        console.error('Error creating user:', error);
        return json({error: 'Erreur lors de la création de l\'utilisateur.'}, {status: 500});
    }
}
