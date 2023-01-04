import {Server as NetServer, Socket} from "net";
import {Server as SocketServer} from "socket.io";
import {NextApiResponse} from "next";

export interface MonopolyPlayer {
    name: string;
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

export interface MonopolyCard {
    name: string;
    description: string;
    type: string;
    amount: number;
    position: number;
    jail: boolean;
    getOutOfJail: boolean;
}
export interface Game {
    id: string;
    name: string;
    owner: string;
    users: string[];
    private: boolean;
    password: string;
    roomType: string;
}

export interface MonopolyGame extends Game {
    players: MonopolyPlayer[];
    turn: number;
    started: boolean;
    finished: boolean;
    winner: string;
    houses: MonopolyHouse[];
    chanceCards: MonopolyCard[];
    communityChestCards: MonopolyCard[];
}

export type NextSocketApiResponse = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketServer;
        };
    };
}