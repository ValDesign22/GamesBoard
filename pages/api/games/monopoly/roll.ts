import {MonopolyHouse, MonopolyPlayer, NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";
import {moveMonopolyPlayer} from "../../../../util/gameFunctions";
import {cases, chancesCards, communityChestCards} from "../../../../util/constants/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    const {gameId,dices: {one, two},user: {id,username}} = req.body;

    const gameDB = await monopoly.findOne({ id: gameId });

    let game = gameDB;

    if (game) {
        let player = game.players.find((player: MonopolyPlayer) => player.name === username);
        if (player) {
            const dices = [one, two];
            const sum = dices.reduce((a, b) => a + b, 0);
            const doubles = dices[0] === dices[1];
            const canReRoll = sum === 12;

            let nextPos = moveMonopolyPlayer(player.position, sum);
            let currentPos = player.position;

            if (player.inJail) {
                if (player.jailTurns === 3) {
                    player.money -= 50;
                    player.jailTurns = 0;
                    player.inJail = false;

                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé 50€ pour sortir de prison`, playerName: player.name });
                } else {
                    if (!doubles) player.jailTurns++;
                    else {
                        player.inJail = false;
                        player.jailTurns = 0;

                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est sorti de prison`, playerName: player.name });
                    }
                }
            }

            if (!player.inJail) {
                const nextCase = cases[nextPos];

                if (nextCase.title.startsWith("Depart") || (player.position > nextPos && player.position > 25 && nextPos < 15)) {
                    player.money += 200;

                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est passé par la case départ et a gagné 200€`, playerName: player.name });

                    if (nextCase.title.startsWith("Impots")) {
                        player.money -= 200;
    
                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé les impots`, playerName: player.name });
                    }
                    if (nextCase.title.startsWith("Taxe")) {
                        player.money -= 100;
    
                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé la taxe de luxe`, playerName: player.name });
                    }
                    if (nextCase.title.startsWith("Chance")) {
                        const cardDB = game.chanceCards[0];
                        game.chanceCards = game.chanceCards.slice(1);
    
                        const card = chancesCards.find((c) => c.name === cardDB.name);
    
                        if (card) {
                            const action = card.action(player, game);
    
                            res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a tiré une carte chance: ${card.title}`, playerName: player.name });
    
                            if (card.type === "move") {
                                player = action.player;
                                game.chanceCards.push(cardDB);
                            }
                            if (card.type === "money") {
                                player = action.player;
                                game.chanceCards.push(cardDB);
                            }  
                            if (card.type === "jail") {
                                if (!card.canBeKept) {
                                    player = action.player;
                                    game.chanceCards.push(cardDB);
                                }
    
                                if (card.canBeKept) player.chanceCardOutOfJail = true;
                            }
    
                            if (action.game !== game) game = action.game;
                        }
                    }
                    if (nextCase.title.startsWith("Caisse")) {
                        const cardDB = game.communityChestCards[0];
                        game.communityChestCards = game.communityChestCards.slice(1);
    
                        const card = communityChestCards.find((c) => c.name === cardDB.name);
    
                        if (card) {
                            const action = card.action(player, game);
    
                            res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a tiré une carte caisse de communauté: ${card.title}`, playerName: player.name });
    
                            if (card.type === "move") {
                                player = action.player;
                                game.communityChestCards.push(cardDB);
                            }
                            if (card.type === "money") {
                                player = action.player;
                                game.communityChestCards.push(cardDB);
                            }  
                            if (card.type === "jail") {
                                if (!card.canBeKept) {
                                    player = action.player;
                                    game.communityChestCards.push(cardDB);
                                }
    
                                if (card.canBeKept) player.communityChestCardOutOfJail = true;
                            }
                        }
                    }
                    if (nextCase.title.startsWith("Allez")) {
                        nextPos = 10;
                        player.inJail = true;
                        player.jailTurns = 0;
    
                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est allé en prison`, playerName: player.name });
                    }
                }

                if (nextCase.title.startsWith("Impots")) {
                    player.money -= 200;

                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé les impots`, playerName: player.name });
                }
                if (nextCase.title.startsWith("Taxe")) {
                    player.money -= 100;

                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé la taxe de luxe`, playerName: player.name });
                }
                if (nextCase.title.startsWith("Chance")) {
                    const cardDB = game.chanceCards[0];
                    game.chanceCards = game.chanceCards.slice(1);

                    const card = chancesCards.find((c) => c.name === cardDB.name);

                    if (card) {
                        const action = card.action(player, game);

                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a tiré une carte chance: ${card.title}`, playerName: player.name });

                        if (card.type === "move") {
                            player = action.player;
                            game.chanceCards.push(cardDB);
                        }
                        if (card.type === "money") {
                            player = action.player;
                            game.chanceCards.push(cardDB);
                        }  
                        if (card.type === "jail") {
                            if (!card.canBeKept) {
                                player = action.player;
                                game.chanceCards.push(cardDB);
                            }

                            if (card.canBeKept) player.chanceCardOutOfJail = true;
                        }

                        if (action.game !== game) game = action.game;
                    }
                }
                if (nextCase.title.startsWith("Caisse")) {
                    const cardDB = game.communityChestCards[0];
                    game.communityChestCards = game.communityChestCards.slice(1);

                    const card = communityChestCards.find((c) => c.name === cardDB.name);

                    if (card) {
                        const action = card.action(player, game);

                        res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a tiré une carte caisse de communauté: ${card.title}`, playerName: player.name });

                        if (card.type === "move") {
                            player = action.player;
                            game.communityChestCards.push(cardDB);
                        }
                        if (card.type === "money") {
                            player = action.player;
                            game.communityChestCards.push(cardDB);
                        }  
                        if (card.type === "jail") {
                            if (!card.canBeKept) {
                                player = action.player;
                                game.communityChestCards.push(cardDB);
                            }

                            if (card.canBeKept) player.communityChestCardOutOfJail = true;
                        }
                    }
                }
                if (nextCase.title.startsWith("Allez")) {
                    nextPos = 10;
                    player.inJail = true;
                    player.jailTurns = 0;

                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est allé en prison`, playerName: player.name });
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

                                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé ${rent}€ à ${propertyOwner!.name} pour la gare ${property.name}`, playerName: player.name });
                                }

                            }
                            if (nextCase.title.startsWith("Compagnie")) {
                                const ownedCompagnies = game.houses.filter((house: MonopolyHouse) => house.name.startsWith("Compagnie") && house.owner === property.owner);
                                const rent = nextCase.rent![ownedCompagnies.length - 1] * sum;
                                if (ownedCompagnies.length !== 0) {
                                    player.money -= rent;
                                    propertyOwner!.money += rent;

                                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé ${rent}€ à ${propertyOwner!.name} pour la compagnie ${property.name}`, playerName: player.name });
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

                                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé ${nextCase.rent![5]}€ à ${propertyOwner!.name} pour l'hôtel ${property.name}`, playerName: player.name });
                                }
                                else {
                                    player.money -= rent;
                                    propertyOwner!.money += rent;

                                    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé ${rent}€ à ${propertyOwner!.name} pour la propriété ${property.name}`, playerName: player.name });
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
                position: currentPos !== player.position ? currentPos : nextPos,
                money: player.money,
                chanceCardOutOfJail: player.chanceCardOutOfJail,
                communityChestCardOutOfJail: player.communityChestCardOutOfJail,
                inJail: player.inJail,
                jailTurns: player.jailTurns,
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
                playerTurn: (!player.inJail && canReRoll) ? username : newPlayers[nextPlayer >= newPlayers.length ? 0 : nextPlayer].name
            };
            await monopoly.findOneAndUpdate({ id: gameId }, newGame);

            res.socket.server.io.emit("monopoly-roll", {gameId, dices: {one, two}, players: newPlayers, player: newPlayer });
        }
    }
    res.status(201).json({message: "Dice rolled"});
}