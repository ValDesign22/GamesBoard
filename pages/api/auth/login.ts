import type { NextApiRequest } from 'next';
import {serialize} from 'cookie';
import {sign} from "jsonwebtoken";
import {NextSocketApiResponse} from "../../../util/types";

export default function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    if (req.method !== 'POST') return res.status(400).json({ message: 'Only POST requests are allowed' });

    const { username, password } = req.body;

    const token = sign({
        id: String(Math.floor(Math.random() * 100000000000000000)),
        username: username,
        password: password
    }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.setHeader('Set-Cookie', serialize(process.env.COOKIE_NAME!, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/',
    }));

    res.status(200).redirect('/games').end();
}
