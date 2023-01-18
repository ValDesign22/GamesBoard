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
        const caseToUpgrade = cases[caseId];

        if (playerIndex !== -1) {
            const playerToUpdate = game.players[playerIndex];
            const house = game.houses.find((h: any) => h.name === caseToUpgrade.title);

            if (house) {
                if (!caseToUpgrade.upgradePrice || (house.owner && (house.owner !== player.name))) return res.status(400).end();

                if (playerToUpdate.money >= caseToUpgrade.upgradePrice) {
                    house.house < 4 ? house.houses += 1 : house.houses = 4;
                    house.house < 4 ? house.hotel = false : house.hotel = true;

                    game.houses = game.houses.map((h: MonopolyHouse) => {
                        if (h.name === house.name) return house;
                        return h;
                    });
                    playerToUpdate.money -= caseToUpgrade.upgradePrice;
                    game.players[playerIndex] = playerToUpdate;

                    await game.save();

                    res.socket.server.io.emit("monopoly-upgrade", {gameId, player: playerToUpdate, caseId, houseCount: house.houses, hotel: house.hotel, cases: game.houses, players: game.players});
                }
            }
        }
    }

    res.status(201).end();
}