import {NextApiRequest} from "next";
import {NextSocketApiResponse} from "../../../../util/types";
import monopoly from "../../../../mongodb/models/monopoly";
import mongoConnect from "../../../../mongodb/mongoConnect";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    if (req.method !== "GET") return res.status(405).json({message: "Method not allowed"});

    const {gameId} = req.query;

    const game = await monopoly.findOne({id: gameId});

    if (!game) return res.status(404).json({message: "Game not found"});

    res.status(200).json(game);
}