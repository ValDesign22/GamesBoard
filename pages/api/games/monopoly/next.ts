import {NextApiRequest} from "next";
import {MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import mongoConnect from "../../../../mongodb/mongoConnect";
import monopoly from "../../../../mongodb/models/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();

    const {player, gameId}: {player: MonopolyPlayer, gameId: string} = req.body;

    const game = await monopoly.findOne({ id: gameId });

    if (!game) return res.status(404).json({ error: "Game not found" });

    res.socket.server.io.emit("monopoly-next", {gameId, player: game.players.find((p: MonopolyPlayer) => p.name === player.name)});

    res.status(200).end();
}