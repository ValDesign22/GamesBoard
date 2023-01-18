import {NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    res.socket.server.io.emit("monopoly-chat", {...req.body});

    res.status(201).json({message: "Message sent"});
}