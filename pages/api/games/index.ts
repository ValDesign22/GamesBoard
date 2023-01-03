import type { NextApiRequest, NextApiResponse } from 'next';
import mongoConnect from "../../../mongodb/mongoConnect";
import rooms from "../../../mongodb/models/rooms";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const roomsList = await rooms.find({});

    res.status(200).json({ rooms: roomsList });
}