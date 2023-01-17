import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';

export function generateConfirmCode() {
    const numbers = '0123456789';

    let code = '';

    for (let i = 0; i < 6; i++)  code += numbers[Math.floor(Math.random() * numbers.length)];

    return code;
}

export function generateUniqueID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let id = '';

    for (let i = 0; i < 20; i++)  id += characters[Math.floor(Math.random() * characters.length)];

    return id;
}

export function encodePassword(password: string) {
    const buff = Buffer.from(password);
    return buff.toString('base64');
}

export function parseUser(ctx: GetServerSidePropsContext): { username: string, id: string } | null {
    if (!ctx.req.headers.cookie) return null;

    const token = parse(ctx.req.headers.cookie)[`${process.env.COOKIE_NAME}`];

    if (!token) return null;

    try {
        const { iat, exp, ...user } = verify(token, process.env.JWT_SECRET!) as { username: string, id: string } & { iat: number; exp: number; };
        return user;
    } catch (err) {
        return null;
    }
}