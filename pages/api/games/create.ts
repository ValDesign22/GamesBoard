import { NextApiRequest } from "next";
import rooms from "../../../mongodb/models/rooms";
import mongoConnect from "../../../mongodb/mongoConnect";
import {generateGameId, shuffleCards} from "../../../util/gameFunctions";
import {MonopolyHouse, NextSocketApiResponse} from "../../../util/types";
import monopoly from "../../../mongodb/models/monopoly";
import {cases, chancesCards, communityChestCards} from "../../../util/constants/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();

    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const {id, name, owner, users, prived, password, roomType} = req.body;

    if (!req.headers.authorization) return res.status(401).json({error: "You are not authenticated"});

    if (req.headers.authorization !== owner) return res.status(401).json({error: "You are not the owner of this room"});

    const room = await rooms.findOne({id: id});
    let newID = id;

    if (room) {
        newID = generateGameId();

        while (await rooms.findOne({ id: newID })) {
            newID = generateGameId();
        }
    }

    const newRoom = await rooms.create({
        id: newID,
        name,
        owner,
        users,
        private: prived,
        password,
        roomType
    });

    if (roomType === "monopoly") {
        let houses: MonopolyHouse[] = [];
        cases.forEach((c) => {
            houses.push({
                name: c.title,
                color: `${c.color}`,
                price: c.price || 0,
                owner: "",
                houses: 0,
                hotel: false,
                hypothecated: false
            });
        });

        let chanceCards = chancesCards;
        let communityChestCardList = communityChestCards;

        await monopoly.create({
            id: newID,
            name,
            owner,
            users,
            private: prived,
            password,
            roomType,
            players: [{
                name: owner,
                position: 0,
                money: 1500,
                chanceCardOutOfJail: false,
                communityChestCardOutOfJail: false,
                inJail: false,
                jailTurns: 0,
                houses: [],
                canReRoll: false,
                doubleRolls: 0
            }],
            turn: 0,
            started: false,
            finished: false,
            winner: "",
            houses: houses,
            chanceCards: shuffleCards(chanceCards),
            communityChestCards: shuffleCards(communityChestCardList),
            playerTurn: owner
        });
    }

    res.status(200).json({room: newRoom});
}