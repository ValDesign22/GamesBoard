import {NextApiRequest} from "next";
import {NextSocketApiResponse} from "../../../../util/types";
import monopoly from "../../../../mongodb/models/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const {gameId} = req.body;

    const gameFind = await monopoly.findOne({ id: gameId });

    if (!gameFind) return res.status(404).json({ error: "Game not found" });

    if (gameFind.started) return res.status(400).json({ error: "Game already started" });

    gameFind.started = true;
    await gameFind.save();

    res.socket.server.io.emit("monopoly-start", { gameId });

    res.status(201).json({ message: "Game started" });
}