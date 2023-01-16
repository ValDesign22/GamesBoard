import {NextSocketApiResponse} from "../../../../util/types";
import {NextApiRequest} from "next";
import mongoConnect from "../../../../mongodb/mongoConnect";
import monopoly from "../../../../mongodb/models/monopoly";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    await mongoConnect();
    const {gameId,player,caseId} = req.body;



    res.status(201).end();
}