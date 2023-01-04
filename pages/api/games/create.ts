import { NextApiRequest } from "next";
import rooms from "../../../mongodb/models/rooms";
import mongoConnect from "../../../mongodb/mongoConnect";
import {generateGameId} from "../../../util/gameFunctions";
import {NextSocketApiResponse} from "../../../util/types";
import monopoly from "../../../mongodb/models/monopoly";

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
        await monopoly.create({
            id: newID,
            name,
            owner,
            users,
            private: prived,
            password,
            roomType,
            players: [],
            turn: 0,
            started: false,
            finished: false,
            winner: "",
            houses: [],
            chanceCards: [],
            communityChestCards: []
        });
    }

    res.status(200).json({room: newRoom});
}