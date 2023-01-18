import { chancesCards, communityChestCards } from "../constants/monopoly";
import { MonopolyCard, MonopolyGame, MonopolyPlayer, NextSocketApiResponse } from "../types";

export const DepartCase = (player: MonopolyPlayer, res: NextSocketApiResponse, nextCase: {
    title: string;
}, game: MonopolyGame) => {
    player.money += 200;
    
    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est passé par la case départ et a gagné 200€`, playerName: player.name });
    
    if (nextCase.title.startsWith("Impots")) ImpotsCase(player, game, res);
    if (nextCase.title.startsWith("Taxe")) TaxeCase(player, game, res);
    if (nextCase.title.startsWith("Chance")) ChanceCase(player, game, res);
    if (nextCase.title.startsWith("Caisse")) CaisseCase(player, game, res);
    if (nextCase.title.startsWith("Allez")) AllezCase(player, game, res);
}

export const ImpotsCase = (player: MonopolyPlayer, game: MonopolyGame, res: NextSocketApiResponse) => {
    player.money -= 200;
    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé les impots`, playerName: player.name });
}

export const TaxeCase = (player: MonopolyPlayer, game: MonopolyGame, res: NextSocketApiResponse) => {
    player.money -= 100;
    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `a payé la taxe de luxe`, playerName: player.name });
}

export const ChanceCase = (player: MonopolyPlayer, game: MonopolyGame, res: NextSocketApiResponse) => {
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

export const CaisseCase = (player: MonopolyPlayer, game: MonopolyGame, res: NextSocketApiResponse) => {
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

        if (action.game !== game) game = action.game;
    }
}

export const AllezCase = (player: MonopolyPlayer, game: MonopolyGame, res: NextSocketApiResponse) => {
    player.position = 10;
    player.inJail = true;
    player.jailTurns = 0;
    
    res.socket.server.io.emit("monopoly-chat", { gameId: game.id, message: `est allé en prison`, playerName: player.name });
}