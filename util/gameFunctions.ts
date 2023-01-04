import { MonopolyHouse, MonopolyPlayer } from "./types";

export function generateGameId() {
    const numbers = '0123456789';

    let code = '';

    for (let i = 0; i < 6; i++)  code += numbers[Math.floor(Math.random() * numbers.length)];

    return code;
}

export function moveMonopolyPlayer(position: number, cases: number) {
    position += cases;
    if (position > 39) position -= 40;
    return position;
}

export function setMonopolyPlayerMoney(player: MonopolyPlayer, money: number) {
    player.money = money;
}

export function setMonopolyPlayerChanceCardOutOfJail(player: MonopolyPlayer, chanceCardOutOfJail: boolean) {
    player.chanceCardOutOfJail = chanceCardOutOfJail;
}

export function setMonopolyPlayerCommunityChestCardOutOfJail(player: MonopolyPlayer, communityChestCardOutOfJail: boolean) {
    player.communityChestCardOutOfJail = communityChestCardOutOfJail;
}

export function setMonopolyPlayerInJail(player: MonopolyPlayer, inJail: boolean) {
    player.position = 10;
    player.inJail = inJail;
    player.jailTurns = 0;
}

export function addHouseToMonopolyPlayer(player: MonopolyPlayer, house: MonopolyHouse) {
    player.houses.push(house);
}

export function removeHouseFromMonopolyPlayer(player: MonopolyPlayer, house: MonopolyHouse) {
    player.houses = player.houses.filter((h) => h !== house);
}

export function addHouseToMonopolyPlayerHouse(player: MonopolyPlayer, house: MonopolyHouse) {
    const index = player.houses.findIndex((h) => h === house);
    
    if (index === -1) return;

    if (house.hotel) return;

    if (house.houses === 4) {
        house.houses = 0;
        house.hotel = true;
    } else house.houses++;

    player.houses[index] = house;
}