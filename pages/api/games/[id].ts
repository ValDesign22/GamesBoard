import { NextApiRequest, NextApiResponse } from "next";
import rooms from "../../../mongodb/models/rooms";
import mongoConnect from "../../../mongodb/mongoConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongoConnect();

    if (req.method === "GET") {
        const { id } = req.query;

        const roomGet = await rooms.findOne({ id: id });

        if (roomGet) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(roomGet);
    } else if (req.method === "POST") {
        const { id } = req.query;

        const roomPost = await rooms.findOne({ id: id });

        if (!roomPost) return res.status(404).json({ message: "Room not found" });

        const { password } = req.body;

        if (password !== roomPost.password) return res.status(401).json({ message: "Wrong password" });

        res.status(200).json(roomPost);
    }
}