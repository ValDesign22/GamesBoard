import {NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    const {gameId,message,playerName} = req.body;

    res.socket.server.io.emit("monopoly-chat", {gameId,message,playerName});

    res.status(201).json({message: "Message sent"});
}