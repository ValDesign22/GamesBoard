export interface MonopolyPlayer {
    position: number;
    money: number;
    chanceCardOutOfJail: boolean;
    communityChestCardOutOfJail: boolean;
    inJail: boolean;
    jailTurns: number;
    houses: MonopolyHouse[];
    canReRoll: boolean;
    doubleRolls: number;
}

export interface MonopolyHouse {
    owner: string;
    color: string;
    price: number;
    houses: number;
    hotel: boolean;
    name: string;
}