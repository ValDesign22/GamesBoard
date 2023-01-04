import type { NextApiRequest } from 'next'
import {NextSocketApiResponse} from "../../util/types";

export default function handler(req: NextApiRequest, res: NextSocketApiResponse) {
  res.status(200).json({ name: 'Welcome to Board Games server' });
}
