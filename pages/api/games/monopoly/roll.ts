import {MonopolyHouse, MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
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
                const nextCase = cases[nextPos];

                if (nextCase.title.startsWith("Depart")) player.money += 200;
                if (player.position > nextPos && player.position > 10 && nextPos < 10) player.money += 200;

                if (nextCase.title.startsWith("Impots")) player.money -= 200;
                if (nextCase.title.startsWith("Taxe")) player.money -= 100;
                if (nextCase.title.startsWith("Caisse")) {}
                if (nextCase.title.startsWith("Chance")) {}
                if (nextCase.title.startsWith("Allez")) {
                    nextPos = 10;
                    inJail = true;
                    jailTurns = 0;
                }

                const property = game.houses.find((house: MonopolyHouse) => house.name === nextCase.title);
                if (property) {
                    if (property.owner) {
                        if (property.owner !== username) {
                            const propertyOwner = game.players.find((p: MonopolyPlayer) => p.name === property.owner);

                            if (nextCase.title.startsWith("Gare")) {
                                const ownedGares = game.houses.filter((house: MonopolyHouse) => house.name.startsWith("Gare") && house.owner === property.owner);
                                if (ownedGares.length !== 0) {
                                    const rent = nextCase.rent![ownedGares.length - 1];
                                    player.money -= rent;
                                    propertyOwner!.money += rent;
                                }

                            }
                            if (nextCase.title.startsWith("Compagnie")) {
                                const ownedCompagnies = game.houses.filter((house: MonopolyHouse) => house.name.startsWith("Compagnie") && house.owner === property.owner);
                                const rent = nextCase.rent![ownedCompagnies.length - 1] * sum;
                                if (ownedCompagnies.length !== 0) {
                                    player.money -= rent;
                                    propertyOwner!.money += rent;
                                }

                            }
                            if (
                                !nextCase.title.startsWith("Gare")
                                && !nextCase.title.startsWith("Compagnie")
                                && !nextCase.title.startsWith("Chance")
                                && !nextCase.title.startsWith("Caisse")
                                && !nextCase.title.startsWith("Allez")
                                && !nextCase.title.startsWith("Taxe")
                                && !nextCase.title.startsWith("Impots")
                                && !nextCase.title.startsWith("Depart")
                            ) {
                                const colorCases = cases.filter((c) => c.color === property.color);
                                const allOwned = colorCases.every((c) => {
                                    const house = game.houses.find((h: MonopolyHouse) => h.name === c.title);
                                    return house && house.owner === property.owner;
                                });

                                const housePrice = nextCase.rent![property.houses];
                                const rent = property.houses !== 0 ? housePrice : (allOwned ? housePrice * 2 : housePrice);

                                if (property.hotel) {
                                    player.money -= nextCase.rent![5];
                                    propertyOwner!.money += nextCase.rent![5];
                                }
                                else {
                                    player.money -= rent;
                                    propertyOwner!.money += rent;
                                }
                            }

                            game.players = game.players.map((p: MonopolyPlayer) => p.name === propertyOwner!.name ? {
                                name: propertyOwner!.name,
                                position: propertyOwner!.position,
                                money: propertyOwner!.money,
                                chanceCardOutOfJail: propertyOwner!.chanceCardOutOfJail,
                                communityCardOutOfJail: propertyOwner!.communityCardOutOfJail,
                                inJail: propertyOwner!.inJail,
                                jailTurns: propertyOwner!.jailTurns,
                                houses: propertyOwner!.houses,
                                canReRoll: propertyOwner!.canReRoll,
                                doubleRolls: propertyOwner!.doubleRolls
                            } : p);
                        }
                    }
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

            res.socket.server.io.emit("monopoly-roll", {gameId, dices: {one, two}, players: newPlayers, player: newPlayer });
        }
    }
    res.status(201).json({message: "Dice rolled"});
}