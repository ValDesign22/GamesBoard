import { connect } from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL!.replace('<user>', process.env.MONGO_USER!).replace('<password>', process.env.MONGO_PASS!).replace('<db>', process.env.MONGO_DB!);

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

// @ts-ignore
let cached = global.mongoose;

// @ts-ignore
if (!cached) cached = global.mongoose = { conn: null, promise: null }

export default async function mongoConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = connect(MONGODB_URI, opts).then((mongoose) => { return mongoose });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}