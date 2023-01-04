import {NextApiRequest} from "next";
import {Server as ServerIO} from "socket.io";
import {Server as NetServer} from "http";
import {NextSocketApiResponse} from "../../util/types";

export default async function handler(req: NextApiRequest, res: NextSocketApiResponse) {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        const httpServer: NetServer = res.socket.server as any;
        res.socket.server.io = new ServerIO(httpServer, {
            path: "/api/socket",
        });
    }
    res.end();
};
