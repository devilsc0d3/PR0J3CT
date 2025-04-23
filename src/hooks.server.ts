import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET || JWT_SECRET === '') {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
}

/**
 * @description Middleware to check if the user is authenticated and set the user in the locals storage
 * @param event
 * @param resolve
 */
export async function handle({ event, resolve }: { event: any; resolve: any }) {
    const token = event.cookies.get('token');

    if (token) {
        try {
            event.locals.user = jwt.verify(token, JWT_SECRET);
        } catch {
            event.locals.user = null;
        }
    }

    return resolve(event);
}
