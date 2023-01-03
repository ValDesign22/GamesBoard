import Head from "next/head";
import {FormEvent, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {generateGameId} from "../../../util/gameFunctions";
import {Game} from "../../../util/types";
import {GetServerSideProps} from "next";

export default function Monopoly(props: { games: Game[] }) {
    const [roomCode, setRoomCode] = useState<string>("");
    const router = useRouter();

    const joinRoom = () => {
        console.log(roomCode);
    }

    const createRoom = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        axios.post("/api/games/create", {
            id: generateGameId(),
            name: e.currentTarget.roomName.value,
            owner: "test",
            users: [],
            prived: e.currentTarget.roomPrivacy === "private",
            password: e.currentTarget.roomPassword.value,
            roomType: e.currentTarget.roomGame.value,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "test"
            }
        }).then(async (res) => {
            if (res.status === 200) {
                await router.push(`/games/${res.data.room.roomType}/${res.data.room.id}`);
            }
        });
    }

    return (
        <>
            <Head>
                <title>Monopoly</title>
                <meta name="description" content="Monopoly" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="roomSelector">
                <div className="container">
                    <div className="roomJoin">
                        <h2>Join a room</h2>
                        <div className="roomJoinForm">
                            <label htmlFor="roomCode">Room code</label>
                            <input type="text" name="roomCode" id="roomCode" onChange={(e) => setRoomCode(e.target.value)} />
                            <button onClick={joinRoom}>Join</button>
                        </div>
                        <h2>Or</h2>
                        <div className="roomList">
                            {/* <div className="room">
                                <h3>Room name</h3>
                                <p>Room code</p>
                                <button>Join</button>
                            </div>
                            <div className="room">
                                <h3>Room name</h3>
                                <p>Room code</p>
                                <button>Join</button>
                            </div>
                            <div className="room">
                                <h3>Room name</h3>
                                <p>Room code</p>
                                <button>Join</button>
                            </div> */}

                            {props.games.map((game) => {
                                return (
                                    <div className="room" key={game.id}>
                                        <h3>{game.name}</h3>
                                        <p>{game.roomType}</p>
                                        <button onClick={() => router.push(`/games/${game.roomType}/${game.id}`)}>Join</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="roomCreate">
                        <div>
                            <h2>Create a room</h2>
                            <form onSubmit={createRoom}>
                                <label htmlFor="roomName">Room name</label>
                                <input type="text" name="roomName" id="roomName" />
                                <label htmlFor="roomPrivacy">Room privacy</label>
                                <select name="roomPrivacy" id="roomPrivacy">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                                <label htmlFor="roomPassword">Room password</label>
                                <input type="password" name="roomPassword" id="roomPassword" />
                                <label htmlFor="roomGame">Room game</label>
                                <select name="roomGame" id="roomGame">
                                    <option value="monopoly">Monopoly</option>
                                </select>
                                <button type="submit">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ games: Game[] }> = async (ctx) => {
    const games = await axios.get(`${process.env.APP_URL}/api/games`);

    return {
        props: {
            games: games.data.rooms
        }
    }
}