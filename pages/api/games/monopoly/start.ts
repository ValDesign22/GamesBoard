import {NextApiRequest} from "next";
import {NextSocketApiResponse} from "../../../../util/types";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const {gameId} = req.body;

    const gameFind = await monopoly.findOne({ id: gameId });

    if (!gameFind || gameFind.started) return res.status(404).json({ error: "Game not found or already started" });

    gameFind.started = true;
    await gameFind.save();

    res.socket.server.io.emit("monopoly-start", { gameId });

    res.status(201).json({ message: "Game started", started: true });
}