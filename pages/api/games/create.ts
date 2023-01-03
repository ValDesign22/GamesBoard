import { NextApiRequest, NextApiResponse } from "next";
import rooms from "../../../mongodb/models/rooms";
import mongoConnect from "../../../mongodb/mongoConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    
    const { id, name, owner, users, prived, password, roomType } = req.body;

    if (!req.headers.authorization) return res.status(401).json({ error: "You are not authenticated" });

    if (req.headers.authorization !== owner) return res.status(401).json({ error: "You are not the owner of this room" });

    new rooms({
        id,
        name,
        owner,
        users,
        private: prived,
        password,
        roomType
    }).save();

    res.status(200).json({ message: "Room created" });
}