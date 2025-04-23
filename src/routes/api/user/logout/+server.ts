import { serialize } from 'cookie';

/**
 * POST /api/user/logout
 * @returns {Promise<Response>}
 */
export async function POST(): Promise<Response> {
    // clear cookie
    const cookie = serialize('token', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0)
    });

    return new Response(JSON.stringify({ message: 'Déconnecté' }), {
        status: 200,
        headers: {
            'Set-Cookie': cookie,
            'Content-Type': 'application/json'
        }
    });
}
