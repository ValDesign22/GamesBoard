import {NextApiRequest} from "next";
import {MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const {gameId, username} = req.body;

    const game = await monopoly.findOne({ id: gameId });

    if (!game) return res.status(404).json({error: "Game not found"});

    if (game.players.length >= 8) return res.status(400).json({error: "Game is full"});

    if (!game.players.find((player: MonopolyPlayer) => player.name === username)) {
        game.players.push({
            name: username,
            position: 0,
            money: 1500,
            chanceCardOutOfJail: false,
            communityChestCardOutOfJail: false,
            inJail: false,
            jailTurns: false,
            houses: [],
            canReRoll: false,
            doubleRolls: 0,
        });

        await game.save();

        res.socket.server.io.emit("monopoly-join", {gameId, username});
    }

    res.status(201).json({message: "Joined game"});
}