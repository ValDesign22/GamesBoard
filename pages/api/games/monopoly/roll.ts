import {MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";
import {moveMonopolyPlayer} from "../../../../util/gameFunctions";
import {cases} from "../../../../util/constants/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    const {gameId,dices: {one, two},user: {id,username}} = req.body;

    const game = await monopoly.findOne({ id: gameId });

    if (game) {
        const player = game.players.find((player: MonopolyPlayer) => player.name === username);
        if (player) {
            const dices = [one, two];
            const sum = dices.reduce((a, b) => a + b, 0);
            const doubles = dices[0] === dices[1];
            const canReRoll = sum === 12;

            let nextPos = moveMonopolyPlayer(player.position, sum);
            let inJail = player.inJail;
            let jailTurns = player.jailTurns;

            if (player.inJail) {
                if (player.jailTurns === 3) {
                    player.money -= 50;
                    player.jailTurns = 0;
                    player.inJail = false;
                } else {
                    if (!doubles) player.jailTurns++;
                    else {
                        player.inJail = false;
                        player.jailTurns = 0;
                    }
                }
            }

            if (!player.inJail) {
                if (cases[nextPos].title.startsWith("Depart")) player.money += 200;
                if (player.position > nextPos && player.position > 10 && nextPos < 10) player.money += 200;

                if (cases[nextPos].title.startsWith("Impots")) player.money -= 200;
                if (cases[nextPos].title.startsWith("Taxe")) player.money -= 100;
                if (cases[nextPos].title.startsWith("Caisse")) {}
                if (cases[nextPos].title.startsWith("Chance")) {}
                if (cases[nextPos].title.startsWith("Gare")) {}
                if (cases[nextPos].title.startsWith("Compagnie")) {}
                if (cases[nextPos].title.startsWith("Allez")) {
                    nextPos = 10;
                    inJail = true;
                    jailTurns = 0;
                }
            }

            const newPlayer = {
                name: player.name,
                position: nextPos,
                money: player.money,
                chanceCardOutOfJail: player.chanceCardOutOfJail,
                communityChestCardOutOfJail: player.communityChestCardOutOfJail,
                inJail: inJail,
                jailTurns: jailTurns,
                houses: player.houses,
                canReRoll: canReRoll,
                doubleRolls: doubles ? player.doubleRolls + 1 : 0
            };
            const newPlayers = game.players.map((player: MonopolyPlayer) => player.name === username ? newPlayer : player);

            const nextPlayer = newPlayers.findIndex((player: MonopolyPlayer) => player.name === username) + 1;
            const newGame = {
                id: game.id,
                name: game.name,
                owner: game.owner,
                users: game.users,
                private: game.private,
                password: game.password,
                roomType: game.roomType,
                players: newPlayers,
                turn: doubles ? game.turn : game.turn + 1,
                started: game.started,
                finished: game.finished,
                winner: game.winner,
                houses: game.houses,
                chanceCards: game.chanceCards,
                communityChestCards: game.communityChestCards,
                playerTurn: (!inJail && canReRoll) ? username : newPlayers[nextPlayer >= newPlayers.length ? 0 : nextPlayer].name
            };
            await monopoly.findOneAndUpdate({ id: gameId }, newGame);

            res.socket.server.io.emit("monopoly-roll", {gameId, dices: {one, two}, player: newPlayer});
        }
    }
    res.status(201).json({message: "Dice rolled"});
}