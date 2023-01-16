import {MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";
import mongoConnect from "../../../../mongodb/mongoConnect";
import monopoly from "../../../../mongodb/models/monopoly";
import { cases } from "../../../../util/constants/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    const {gameId,player,caseId} = req.body;

    const game = await monopoly.findOne({id: gameId});

    if (game) {
        const playerIndex = game.players.findIndex((p: MonopolyPlayer) => p.name === player.name);
        const caseToBuy = cases[caseId];

        if (playerIndex !== -1) {
            const playerToBuy = game.players[playerIndex];

            if (!game.houses.find((h: any) => h.name === caseToBuy.title)) {
                if (!caseToBuy.price) return res.status(400).end();

                if (playerToBuy.money >= caseToBuy.price) {
                    game.houses.push({
                        name: caseToBuy.title,
                        color: caseToBuy.color,
                        price: caseToBuy.price,
                        owner: player.name,
                        houses: 0,
                        hotel: false,
                        hypothecated: false,
                    });

                    playerToBuy.money -= caseToBuy.price;

                    game.players[playerIndex] = playerToBuy;

                    await game.save();

                    res.socket.server.io.emit("monopoly-buy", {gameId, player, caseId});
                }
            }
        }
    }

    res.status(201).end();
}