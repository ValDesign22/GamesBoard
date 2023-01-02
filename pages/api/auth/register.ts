import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import mongoConnect from "../../../mongodb/mongoConnect";
import users from "../../../mongodb/models/users";
import {encodePassword, generateConfirmCode, generateUniqueID} from "../../../util/authFunctions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== 'POST')  return res.status(400).json({ message: 'Only POST requests are allowed' });

    const { username, email, password } = req.body;

    if (!username || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });

    const user = await users.findOne({ email });

    if (user) return res.status(400).json({ message: 'User already exists' });

    const confirmCode = generateConfirmCode();
    const userId = generateUniqueID();

    new users({
        id: userId,
        username: username,
        email: email,
        password: encodePassword(password),
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmed: "Pending",
        confirmCode: confirmCode,
    }).save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Confirm your email',
        html: `<div style="text-align: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            <h1>Bonjour, ${username}!</h1>
            <p>Merci de vous être inscrit sur Board Games! Merci de confirmer votre adresse email en cliquant sur le bouton ci-dessous.</p>
            <a href="${process.env.APP_URL}/app/confirm/${userId}" style="text-decoration: none; color: white; background-color: #000; padding: 1rem 2rem; border-radius: 0.5rem;" target="_blank">Confirm</a>
            <p style="margin-top: 1rem;">Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</p>
            <p style="margin-top: 1rem;">Votre code de confirmation: <span style="font-weight: bold;">${confirmCode}</span></p>
            <p style="margin-top: 1rem;">Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante: <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a></p>
            <p style="margin-top: 1rem;">L'équipe de ${process.env.APP_NAME}</p>
            <p style="margin-top: 1rem;">Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p style="margin-top: 1rem;">© ${new Date().getFullYear()} ${process.env.APP_NAME}</p>
            <p style="margin-top: 1rem;">${process.env.APP_URL}</p>
        </div>`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) console.log(err);
    });

    return res.status(200).end();
}