import {Schema, model, models} from "mongoose";

export default models.monopoly || model("monopoly", new Schema({
    id: { type: String, required: true }, // The id of the game
    name: { type: String, required: true }, // The name of the game
    owner: { type: String, required: true }, // The owner of the game
    users: { type: [String], required: false }, // The users in the game
    private: { type: Boolean, required: true }, // If the game is private or not
    password: { type: String, required: false }, // The password to join the game, only if the game is private
    roomType: { type: String, required: true }, // Game type: "Monopoly"
    players: { type: [{
        name: { type: String, required: true }, // The name of the player
        position: { type: Number, required: true }, // The position of the player
        money: { type: Number, required: true }, // The money of the player
        chanceCardOutOfJail: { type: Boolean, required: true }, // If the player has a chance card out of jail
        communityChestCardOutOfJail: { type: Boolean, required: true }, // If the player has a community chest card out of jail
        inJail: { type: Boolean, required: true }, // If the player is in jail
        jailTurns: { type: Number, required: true }, // The number of turns the player has been in jail
        houses: { type: [{
            name: { type: String, required: true }, // The name of the house
            color: { type: String, required: true }, // The color of the house
            houses: { type: Number, required: true }, // The number of houses on the house
            hotel: { type: Boolean, required: true }, // If the house has a hotel
        }], required: true }, // The houses of the player
        canReRoll: { type: Boolean, required: true }, // If the player can re-roll the dice
        doubleRolls: { type: Number, required: true }, // The number of double rolls in a row
    }], required: true }, // The players in the game
    turn: { type: Number, required: true }, // The turn of the game
    doubles: { type: Number, required: true }, // The number of doubles in a row
    dice: { type: [Number], required: true }, // The dice of the game
    started: { type: Boolean, required: true }, // If the game has started or not
    finished: { type: Boolean, required: true }, // If the game has finished or not
    winner: { type: String, required: false }, // The winner of the game
    houses: { type: [{
        name: { type: String, required: true }, // The name of the house
        color: { type: String, required: true }, // The color of the house
        price: { type: Number, required: true }, // The price of the house
        owner: { type: String, required: false }, // The owner of the house
        houses: { type: Number, required: true }, // The number of houses on the house
        hotel: { type: Boolean, required: true }, // If the house has a hotel
    }], required: true },
    chanceCards: { type: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true }, 
        amount: { type: Number, required: true },
        position: { type: Number, required: true },
        jail: { type: Boolean, required: true },
        getOutOfJail: { type: Boolean, required: true },
    }], required: true },
    communityChestCards: { type: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        position: { type: Number, required: true },
        jail: { type: Boolean, required: true },
        getOutOfJail: { type: Boolean, required: true },
    }], required: true }
}));