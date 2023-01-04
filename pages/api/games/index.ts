import type { NextApiRequest } from 'next';
import mongoConnect from "../../../mongodb/mongoConnect";
import rooms from "../../../mongodb/models/rooms";
import {NextSocketApiResponse} from "../../../util/types";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();

    if (req.method !== "GET") return res.status(405).json({error: "Method not allowed"});

    const roomsList = await rooms.find({});

    res.status(200).json({ rooms: roomsList });
}