import {MonopolyHouse, MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
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

            const dbCase = game.houses.find((h: any) => h.name === caseToBuy.title);

            if (dbCase) {
                if (dbCase.owner && (dbCase.owner !== player.name)) return res.status(400).end();
                if (!caseToBuy.price) return res.status(400).end();

                if (playerToBuy.money >= caseToBuy.price) {
                    game.houses = game.houses.map((house: MonopolyHouse) => {
                        if (house.name === dbCase.name) house.owner = player.name;
                        return house;
                    })
                    playerToBuy.money -= caseToBuy.price;
                    game.players[playerIndex] = playerToBuy;

                    await game.save();

                    res.socket.server.io.emit("monopoly-buy", {gameId, player, caseId, cases: game.houses, players: game.players});
                    res.socket.server.io.emit("monopoly-next", {gameId, player});
                }
            }
        }
    }

    res.status(201).end();
}