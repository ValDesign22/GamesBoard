import {NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    const {gameId,num,user: {id,username}} = req.body;

    res.socket.server.io.emit("monopoly-roll", {gameId,num,user: {id,username}});

    res.status(201).json({message: "Dice rolled"});
}