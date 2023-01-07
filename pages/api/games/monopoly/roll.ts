import {MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";
import {moveMonopolyPlayer} from "../../../../util/gameFunctions";

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
            const reroll = sum === 12;
            const newPlayer = {
                name: player.name,
                position: moveMonopolyPlayer(player.position, sum),
                money: player.money,
                chanceCardOutOfJail: player.chanceCardOutOfJail,
                communityChestCardOutOfJail: player.communityChestCardOutOfJail,
                inJail: player.inJail,
                jailTurns: player.jailTurns,
                houses: player.houses,
                canReRoll: reroll,
                doubleRolls: doubles ? player.doubleRolls + 1 : 0
            };
            const newPlayers = game.players.map((player: MonopolyPlayer) => player.name === username ? newPlayer : player);

            const nextPlayer = newPlayers.findIndex((player: MonopolyPlayer) => player.name === username) + 1;
            const newTurn = nextPlayer >= newPlayers.length ? 0 : nextPlayer;

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
                playerTurn: reroll ? username : newPlayers[newTurn].name
            };
            await monopoly.findOneAndUpdate({ id: gameId }, newGame);

            res.socket.server.io.emit("monopoly-roll", {gameId, dices: {one, two}, player: newPlayer});
        }
    }
    res.status(201).json({message: "Dice rolled"});
}