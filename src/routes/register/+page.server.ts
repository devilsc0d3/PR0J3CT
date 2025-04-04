import bcrypt from 'bcrypt';
import {type Actions, redirect, type RequestEvent} from '@sveltejs/kit';


export const actions:Actions = {
    register: async({request}:RequestEvent) => {
        // recuperation de email & password
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        // Check email with post request api/user/findemail
        const checkEmail = await fetch('http://localhost:5173/api/user/findemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (!checkEmail.ok) {
            return { error: 'Email already exists' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with request post api/user
        const createUser = await fetch('http://localhost:5173/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: hashedPassword }),
        });

        if (!createUser.ok) {
            return { error: 'Error creating user' };
        } else {
            throw redirect(303, '/login');
        }
    },
};
