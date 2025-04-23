import {json} from '@sveltejs/kit';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {serialize} from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
}

/**
 * POST /api/user/login
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

        // check user email
        const user = await prisma.users.findUnique({where: {email}});
        if (!user) {
            return json({error: 'bad Credentials'}, {status: 400});
        }

        // check user password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return json({error: 'bad Credentials'}, {status: 400});
        }

        // save token in cookie
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '4h'});
        const cookie = serialize('token', token, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 4 // 4 hours
        });

        return new Response(JSON.stringify({message: 'Connecté avec succès.'}), {
            status: 200,
            headers: {
                'Set-Cookie': cookie,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return json({error: 'Erreur lors de la connexion de l\'utilisateur.'}, {status: 500});
    }
}