import Head from "next/head";
import {FormEvent, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {generateGameId} from "../../../util/gameFunctions";
import {Game} from "../../../util/types";
import {GetServerSideProps} from "next";
import {parseUser} from "../../../util/authFunctions";

export default function Monopoly(props: { games: Game[], user: { username: string, id: string } }) {
    const [roomCode, setRoomCode] = useState<string>("");
    const [roomPrivate, setRoomPrivate] = useState<boolean>(false);
    const router = useRouter();

    const joinRoom = (game: Game) => {
        if (game.private) {
            const password = prompt("Merci d'entrer le mot de passe de la partie");

            if (password !== game.password) return alert("Le mot de passe est incorrect");
        }
        else {
            if (game.password) {
                const password = prompt("Merci d'entrer le mot de passe de la partie");

                if (password !== game.password) return alert("Le mot de passe est incorrect");
            }
        }

        router.push(`/games/${game.roomType}/${game.id}`);
    }

    const joinRoomByCode = (e: FormEvent) => {
        e.preventDefault();
        const game = props.games.find(game => game.id === roomCode);

        if (game) joinRoom(game);
        else alert("Cette partie n'existe pas");
    }

    const createRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = e.currentTarget.roomName.value;

        if (!name) return alert("Merci d'entrer un nom de partie");

        axios.post("/api/games/create", {
            id: generateGameId(),
            name: name,
            owner: props.user.username,
            users: [props.user.username],
            prived: e.currentTarget.roomPrivacy.value === "private",
            password: e.currentTarget.roomPassword.value,
            roomType: e.currentTarget.roomGame.value,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${props.user.username}`
            }
        }).then(async (res) => {
            if (res.status === 200) await router.push(`/games/${res.data.room.roomType}/${res.data.room.id}`);
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
                        <h2>Rejoindre une partie</h2>
                        <form className="roomJoinForm">
                            <label htmlFor="roomCode">Code de la partie</label>
                            <input type="text" name="roomCode" id="roomCode" onChange={(e) => setRoomCode(e.target.value)} />
                            <button onClick={joinRoomByCode}>Rejoindre</button>
                        </form>
                        <h2>Ou</h2>
                        <div className="roomList">
                            {props.games.filter((game) => {
                                if (game.roomType === "monopoly") return game;
                            }).map((game) => {
                                if (game.private) return null;
                                return (
                                    <div className="room" key={game.id}>
                                        <h3>{game.name}</h3>
                                        <p>{game.roomType}</p>
                                        <button onClick={() => joinRoom(game)}>Rejoindre</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="roomCreate">
                        <div>
                            <h2>Créer une partie</h2>
                            <form onSubmit={createRoom}>
                                <label htmlFor="roomName">Nom de la partie</label>
                                <input type="text" name="roomName" id="roomName" />
                                <label htmlFor="roomPrivacy">Type de partie</label>
                                <select name="roomPrivacy" id="roomPrivacy" onChange={(e) => setRoomPrivate(e.target.value === "private")}>
                                    <option value="public">Publique</option>
                                    <option value="private">Privée</option>
                                </select>
                                <label htmlFor="roomPassword">Mot de passe</label>
                                <input type="password" name="roomPassword" id="roomPassword" required={roomPrivate} />
                                <label htmlFor="roomGame">Jeu</label>
                                <select name="roomGame" id="roomGame">
                                    <option value="monopoly">Monopoly</option>
                                </select>
                                <button type="submit">Créer</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ games: Game[], user: { username: string, id: string } }> = async (context) => {
    const games = await axios.get(`${process.env.APP_URL}/api/games`);
    const user = parseUser(context);

    if (!user) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    return {
        props: {
            games: games.data.rooms,
            user
        }
    }
}