import Head from "next/head";
import { useState } from "react";

export default function Monopoly() {
    const [roomCode, setRoomCode] = useState<string>("");

    const joinRoom = () => {
        console.log(roomCode);
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
                            <div className="room">
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
                            </div>
                        </div>
                    </div>
                    <div className="roomCreate">
                        <div>
                            <h2>Create a room</h2>
                            <form>
                                <label htmlFor="roomName">Room name</label>
                                <input type="text" name="roomName" id="roomName" />
                                <select name="roomPrivacy" id="roomPrivacy">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
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