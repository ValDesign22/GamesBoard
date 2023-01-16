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
        const caseToUpgrade = cases[caseId];

        if (playerIndex !== -1) {
            const playerToUpgrade = game.players[playerIndex];

            if (game.houses.find((h: any) => h.name === caseToUpgrade.title)) {
                const house = game.houses.find((h: any) => h.name === caseToUpgrade.title);

                if (house.houses < 4) {
                    if (!caseToUpgrade.upgradePrice) return res.status(400).end();

                    if (playerToUpgrade.money >= caseToUpgrade.upgradePrice) {
                        house.houses += 1;

                        playerToUpgrade.money -= caseToUpgrade.upgradePrice;

                        game.players[playerIndex] = playerToUpgrade;

                        await game.save();

                        res.socket.server.io.emit("monopoly-upgrade", {gameId, player, caseId, houseCount: house.houses, hotel: false, cases: game.houses, players: game.players});
                    }
                }
                else {
                    if (!caseToUpgrade.upgradePrice) return res.status(400).end();

                    if (playerToUpgrade.money >= caseToUpgrade.upgradePrice) {
                        house.hotel = true;

                        playerToUpgrade.money -= caseToUpgrade.upgradePrice;

                        game.players[playerIndex] = playerToUpgrade;

                        await game.save();

                        res.socket.server.io.emit("monopoly-upgrade", {gameId, player, caseId, houseCount: house.houses, hotel: true, cases: game.houses, players: game.players});
                    }
                }
            }
        }
    }

    res.status(201).end();
}