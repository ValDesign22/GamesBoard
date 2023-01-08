import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import {FormEvent, useEffect, useRef, useState} from "react";
import {MonopolyGame, MonopolyPlayer} from "../../../../util/types";
import axios from "axios";
import {parseUser} from "../../../../util/authFunctions";
import SocketIOClient from "socket.io-client";
import {cases} from "../../../../util/constants/monopoly";

export default function Room(props: {game: MonopolyGame, user: {username: string, id: string}}) {
    const [rolling, setRolling] = useState(false);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [started, setStarted] = useState(props.game.started);
    const [players, setPlayers] = useState<MonopolyPlayer[]>(props.game.players);
    const [player, setPlayer] = useState<MonopolyPlayer>(players.find(p => p.name === props.user.username)!);
    const [playerTurn, setPlayerTurn] = useState(players.find(p => p.name === props.game.playerTurn)!);

    const messageRef = useRef<HTMLTextAreaElement>(null);

    const chancesCards: {
        title: string;
        action: (player: MonopolyPlayer, players: MonopolyPlayer[]) => void;
        canBeKept?: boolean;
    }[]
        = [
        {
            title: "Rendez-vous à la Rue de la Paix",
            action: (player: MonopolyPlayer) => {
                player.position = 39;
            }
        },
        {
            title: "Avancer jusqu'à la case départ",
            action: (player: MonopolyPlayer) => {
                player.position = 0;
            }
        },
        {
            title: "Rendez-vous au Boulevard Henri-Martin. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
                if (player.position > 24) player.money += 200;

                player.position = 24;
            }
        },
        {
            title: "Avancez au Boulevard de la Villette. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
                if (player.position > 11) player.money += 200;

                player.position = 11;
            }
        },
        {
            title: "Vous êtes imposé pour les réparations de voirie à raison de 40M par maison et 115M par hôtel.",
            action: (player: MonopolyPlayer) => {
                let playerHouses = 0;
                let playerHotels = 0;

                for (let i = 0; i < player.houses.length; i++) {
                    if (player.houses[i].houses > 0) playerHouses += player.houses[i].houses;
                    if (player.houses[i].hotel) playerHotels++;
                }

                player.money -= (playerHouses * 40) + (playerHotels * 115);
            }
        },
        {
            title: "Avancez jusqu'à la Gare de Lyon. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
                if (player.position > 15) player.money += 200;

                player.position = 15;
            }
        },
        {
            title: "Vous avez gagné le prix de mots croisés. Recevez 100M",
            action: (player: MonopolyPlayer) => {
                player.money += 100;
            }
        },
        {
            title: "La banque vous verse un dividende de 50M",
            action: (player: MonopolyPlayer) => {
                player.money += 50;
            }
        },
        {
            title: "Vous êtes libéré de prison. Cette carte peut être conservée jusq'à ce qu'elle soit utilisée ou vendue.",
            action: (player: MonopolyPlayer) => {
                player.inJail = false;
                player.jailTurns = 0;
            },
            canBeKept: true
        },
        {
            title: "Reculez de trois cases",
            action: (player: MonopolyPlayer) => {
                player.position -= 3;
            }
        },
        {
            title: "Aller en prison. Rendez-vous directement en prison. Ne franchissez pas par la case départ, ne touchez pas 200M",
            action: (player: MonopolyPlayer) => {
                player.position = 10;
                player.inJail = true;
                player.jailTurns = 0;
            }
        },
        {
            title: "Faites des réparations dans toutes vos maisons. Versez pour chaque maison 25M et pour chaque hôtel 100M",
            action: (player: MonopolyPlayer) => {
                let playerHouses = 0;
                let playerHotels = 0;

                for (let i = 0; i < player.houses.length; i++) {
                    if (player.houses[i].houses > 0) playerHouses += player.houses[i].houses;
                    if (player.houses[i].hotel) playerHotels++;
                }

                player.money -= (playerHouses * 25) + (playerHotels * 100);
            }
        },
        {
            title: "Amende pour excès de vitesse 15M",
            action: (player: MonopolyPlayer) => {
                player.money -= 15;
            }
        },
        {
            title: "Payer pour frais de scolarité 150M",
            action: (player: MonopolyPlayer) => {
                player.money -= 150;
            }
        },
        {
            title: "Amende pour ivresse 20M",
            action: (player: MonopolyPlayer) => {
                player.money -= 20;
            }
        },
        {
            title: "Votre immeuble et votre prêt rapportent. Vous devez toucher 150M",
            action: (player: MonopolyPlayer) => {
                player.money += 150;
            }
        }
    ];
    const communityChestCards: {
        title: string;
        action: (player: MonopolyPlayer, players: MonopolyPlayer[]) => void;
        canBeKept?: boolean;
    }[]
        = [
        {
            title: "Placez-vous sur la case départ. (Collectez 200M)",
            action: (player: MonopolyPlayer) => {
                player.position = 0;
                player.money += 200;
            }
        },
        {
            title: "Erreur de la banque en votre faveur. Recevez 200M",
            action: (player: MonopolyPlayer) => {
                player.money += 200;
            }
        },
        {
            title: "Payez la note du médecin 50M",
            action: (player: MonopolyPlayer) => {
                player.money -= 50;
            }
        },
        {
            title: "La vente de votre stock vous rapporte 50M",
            action: (player: MonopolyPlayer) => {
                player.money += 50;
            }
        },
        {
            title: "Vous êtes libéré de prison. Cette carte peut être conservée jusqu'à ce qu'elle soit utilisée ou vendue.",
            action: (player: MonopolyPlayer) => {
                player.inJail = false;
                player.jailTurns = 0;
            },
            canBeKept: true
        },
        {
            title: "Retournez à Belleville",
            action: (player: MonopolyPlayer) => {
                player.position = 1;
            }
        },
        {
            title: "Recevez votre revenu annuel 100M",
            action: (player: MonopolyPlayer) => {
                player.money += 100;
            }
        },
        {
            title: "C'est votre anniversaire. Chaque joueur doit vous donner 10M",
            action: (player: MonopolyPlayer, players: MonopolyPlayer[]) => {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].name !== player.name) {
                        players[i].money -= 10;
                        player.money += 10;
                    }
                }
            }
        },
        {
            title: "Les contributions vous remboursent la somme de 20M",
            action: (player: MonopolyPlayer) => {
                player.money += 20;
            }
        },
        {
            title: "Recevez votre intérêt sur l'emprunt à 7% 25M",
            action: (player: MonopolyPlayer) => {
                player.money += 25;
            }
        },
        {
            title: "Payez votre Police d'Assurance 50M",
            action: (player: MonopolyPlayer) => {
                player.money -= 50;
            }
        },
        {
            title: "Payez une amende de 10M ou bien tirez une carte Chance",
            action: (player: MonopolyPlayer) => {
                player.money -= 10;
            }
        },
        {
            title: "Rendez-vous à la gare la plus proche. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
                const gares = [5, 15, 25, 35];
                const newPoses = [];

                for (let i = 0; i < gares.length; i++) newPoses.push(Math.min(Math.abs(player.position - gares[i]), Math.abs(player.position - (gares[i] + 40))));

                const newPlayerPos = gares[newPoses.indexOf(Math.min(...newPoses))];

                if (newPlayerPos < player.position) player.money += 200;

                player.position = newPlayerPos;
            }
        },
        {
            title: "Vous avez gagné le deuxième Prix de Beauté. Recevez 10M",
            action: (player: MonopolyPlayer) => {
                player.money += 10;
            }
        },
        {
            title: "Vous héritez 100M",
            action: (player: MonopolyPlayer) => {
                player.money += 100;
            }
        }
    ];
    const playerColor = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8000", "#8000ff", "#0080ff", "#ff0080", "#00ff80", "#80ff00"];

    const sendMessage = () => {
        const gameId = props.game.id;
        const playerName = props.user?.username || "Anonyme";

        axios.post("/api/games/monopoly/chat", {
            gameId,
            message,
            playerName
        }).then(() => {
            setMessage("");
            messageRef.current?.focus();
        });
    }

    const startGame = () => {
        if (players.length < 2) return;

        if (props.game.owner !== props.user.username) return;

        axios.post("/api/games/monopoly/start", {
            gameId: props.game.id
        }).then((res) => {
            setStarted(res.data.started);
        });
    }

    const shareGame = () => {
        if (navigator.share) navigator.share({
            title: "GamesBoard",
            text: "Rejoins moi pour jouer au Monopoly !",
            url: window.location.href
        });
        else navigator.clipboard.writeText(`Rejoins moi pour jouer au Monopoly : ${window.location.href}`)
            .then(() => alert("Lien copié dans le presse-papier !"))
            .catch(() => alert("Impossible de copier le lien dans le presse-papier !"));
    }

    const drawDots = (dotsGroup: HTMLCollectionOf<HTMLDivElement>, dots: number) => {
        if (dots === 1) {
            dotsGroup[0].children[0].className = "dot center"
            dotsGroup[0].children[1].className = "dot";
            dotsGroup[0].children[2].className = "dot";
            dotsGroup[0].children[3].className = "dot";
            dotsGroup[0].children[4].className = "dot";
            dotsGroup[0].children[5].className = "dot";
        }
        else if (dots === 2) {
            dotsGroup[0].children[0].className = "dot top-left";
            dotsGroup[0].children[1].className = "dot";
            dotsGroup[0].children[2].className = "dot";
            dotsGroup[0].children[3].className = "dot";
            dotsGroup[0].children[4].className = "dot";
            dotsGroup[0].children[5].className = "dot bottom-right";
        }
        else if (dots === 3) {
            dotsGroup[0].children[0].className = "dot top-left";
            dotsGroup[0].children[1].className = "dot";
            dotsGroup[0].children[2].className = "dot center";
            dotsGroup[0].children[3].className = "dot";
            dotsGroup[0].children[4].className = "dot";
            dotsGroup[0].children[5].className = "dot bottom-right";
        }
        else if (dots === 4) {
            dotsGroup[0].children[0].className = "dot top-left";
            dotsGroup[0].children[1].className = "dot";
            dotsGroup[0].children[2].className = "dot top-right";
            dotsGroup[0].children[3].className = "dot bottom-left";
            dotsGroup[0].children[4].className = "dot";
            dotsGroup[0].children[5].className = "dot bottom-right";
        }
        else if (dots === 5) {
            dotsGroup[0].children[0].className = "dot top-left";
            dotsGroup[0].children[1].className = "dot";
            dotsGroup[0].children[2].className = "dot top-right";
            dotsGroup[0].children[3].className = "dot center";
            dotsGroup[0].children[4].className = "dot bottom-left";
            dotsGroup[0].children[5].className = "dot bottom-right";
        }
        else if (dots === 6) {
            dotsGroup[0].children[0].className = "dot top-left";
            dotsGroup[0].children[1].className = "dot top";
            dotsGroup[0].children[2].className = "dot top-right";
            dotsGroup[0].children[3].className = "dot bottom-left";
            dotsGroup[0].children[4].className = "dot bottom";
            dotsGroup[0].children[5].className = "dot bottom-right";
        }
    }

    const diceRoll = () => {
        if (rolling) return;

        setRolling(true);

        const dice1 = document.getElementById("dice1") as HTMLDivElement;
        const dotsGroup1 = dice1.getElementsByClassName("dots-group") as HTMLCollectionOf<HTMLDivElement>;
        const dice2 = document.getElementById("dice2") as HTMLDivElement;
        const dotsGroup2 = dice2.getElementsByClassName("dots-group") as HTMLCollectionOf<HTMLDivElement>;

        const dice1Num = Math.floor(Math.random() * 6) + 1;
        const dice2Num = Math.floor(Math.random() * 6) + 1;

        dice1.classList.add("roll");
        dice2.classList.add("roll");

        setTimeout(async () => {
            dice1.classList.remove("roll")
            dice2.classList.remove("roll")

            drawDots(dotsGroup1, dice1Num);
            drawDots(dotsGroup2, dice2Num);

            await axios.post("/api/games/monopoly/roll", {
                gameId: props.game.id,
                dices: {
                    one: dice1Num,
                    two: dice2Num
                },
                user: {
                    id: props.user?.id,
                    username: props.user?.username
                }
            });
        }, 1000);

        setRolling(false);
    }

    const drawPlayers = (players: MonopolyPlayer[]) => {
        const playersDiv = document.getElementById("players") as HTMLDivElement;
        const playersGroup = playersDiv.getElementsByClassName("players-group") as HTMLCollectionOf<HTMLDivElement>;

        playersGroup[0].innerHTML = "";

        players.forEach((player, index) => {
            const playerDiv = document.createElement("div") as HTMLDivElement;
            playerDiv.className = "player";
            playerDiv.style.backgroundColor = playerColor[index];
            playerDiv.id = player.name;

            playersGroup[0].appendChild(playerDiv);

            updatePlayerPos(player);
        });
    }

    const updatePlayerPos = (player: MonopolyPlayer) => {
        const playerElement = document.getElementById(player.name) as HTMLDivElement;
        const playerPosition = player.position;

        // Bottom part of the board
        if (playerPosition === 0) {
            playerElement.style.right = "50px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 1) {
            playerElement.style.right = "200px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 2) {
            playerElement.style.right = "300px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 3) {
            playerElement.style.right = "400px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 4) {
            playerElement.style.right = "500px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 5) {
            playerElement.style.right = "600px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 6) {
            playerElement.style.right = "700px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 7) {
            playerElement.style.right = "800px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 8) {
            playerElement.style.right = "900px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 9) {
            playerElement.style.right = "1000px";
            playerElement.style.bottom = "50px";
        }
        else if (playerPosition === 10) {
            playerElement.style.right = "1150px";
            playerElement.style.bottom = "50px";
        }

        // Left part of the board
        else if (playerPosition === 11) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "200px";
        }
        else if (playerPosition === 12) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "300px";
        }
        else if (playerPosition === 13) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "400px";
        }
        else if (playerPosition === 14) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "500px";
        }
        else if (playerPosition === 15) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "600px";
        }
        else if (playerPosition === 16) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "700px";
        }
        else if (playerPosition === 17) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "800px";
        }
        else if (playerPosition === 18) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "900px";
        }
        else if (playerPosition === 19) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "1000px";
        }
        else if (playerPosition === 20) {
            playerElement.style.left = "50px";
            playerElement.style.bottom = "1150px";
        }

        // Top part of the board
        else if (playerPosition === 21) {
            playerElement.style.left = "200px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 22) {
            playerElement.style.left = "300px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 23) {
            playerElement.style.left = "400px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 24) {
            playerElement.style.left = "500px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 25) {
            playerElement.style.left = "600px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 26) {
            playerElement.style.left = "700px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 27) {
            playerElement.style.left = "800px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 28) {
            playerElement.style.left = "900px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 29) {
            playerElement.style.left = "1000px";
            playerElement.style.top = "50px";
        }
        else if (playerPosition === 30) {
            playerElement.style.left = "1150px";
            playerElement.style.top = "50px";
        }

        // Right part of the board
        else if (playerPosition === 31) {
            playerElement.style.right = "50px";
            playerElement.style.top = "200px";
        }
        else if (playerPosition === 32) {
            playerElement.style.right = "50px";
            playerElement.style.top = "300px";
        }
        else if (playerPosition === 33) {
            playerElement.style.right = "50px";
            playerElement.style.top = "400px";
        }
        else if (playerPosition === 34) {
            playerElement.style.right = "50px";
            playerElement.style.top = "500px";
        }
        else if (playerPosition === 35) {
            playerElement.style.right = "50px";
            playerElement.style.top = "600px";
        }
        else if (playerPosition === 36) {
            playerElement.style.right = "50px";
            playerElement.style.top = "700px";
        }
        else if (playerPosition === 37) {
            playerElement.style.right = "50px";
            playerElement.style.top = "800px";
        }
        else if (playerPosition === 38) {
            playerElement.style.right = "50px";
            playerElement.style.top = "900px";
        }
        else if (playerPosition === 39) {
            playerElement.style.right = "50px";
            playerElement.style.top = "1000px";
        }
    }

    // Websocket UseEffect
    useEffect((): any => {
        const socket = SocketIOClient(process.env.APP_URL!, {
            path: "/api/socket"
        });

        socket.on("connect", async () => {
            console.log("Connected to socket");
            setConnected(true);

            await axios.post("/api/games/monopoly/join", {
                gameId: props.game.id,
                username: props.user?.username
            });
        });

        socket.on("monopoly-join", async (data: { gameId: string, username: string }) => {
            if (data.gameId === props.game.id) {
                messages.push({ username: "Monopoly", message: `${data.username} a rejoint la partie` });
                setMessages([...messages]);

                const gameData = await axios.get("/api/games/monopoly/game", {
                    params: {
                        gameId: props.game.id
                    }
                });

                setStarted(gameData.data.started);
                setPlayers(gameData.data.players);

                const userPlayer = players.find(player => player.name = props.user?.username);
                if (userPlayer) setPlayer(userPlayer);
            }
        });

        socket.on("monopoly-start", (data: { gameId: string }) => {
            if (data.gameId === props.game.id) {
                setStarted(true);
                messages.push({ username: "Monopoly", message: `La partie a commencé` });
                setMessages([...messages]);

                const userPlayer = players.find(player => player.name = props.user?.username);
                if (userPlayer) setPlayer(userPlayer);
            }
        });

        socket.on("monopoly-chat", (data: { gameId: string; message: string; playerName: string }) => {
            if (data.gameId === props.game.id) {
                messages?.push({ username: data.playerName, message: data.message });
                setMessages([...messages!]);
            }
        });

        socket.on("monopoly-roll", (data: { gameId: string; dices: { one: number, two: number }; player: MonopolyPlayer }) => {
            if (data.gameId === props.game.id) {
                messages?.push({ username: data.player.name, message: `a fait ${data.dices.one} et ${data.dices.two}` });
                setPlayers(players.map(player => {
                    if (player.name === data.player.name) return data.player;
                    return player;
                }));

                if (data.player.canReRoll) {
                    messages?.push({ username: "Monopoly", message: `${data.player.name} peut rejouer` });
                    setPlayerTurn(data.player);
                }
                else {
                    const nextPlayer = players.findIndex(player => player.name === data.player.name) + 1;
                    const nextPData = players[nextPlayer >= players.length ? 0 : nextPlayer];

                    messages?.push({ username: "Monopoly", message: `C'est au tour de ${nextPData.name} de jouer` });
                    setPlayerTurn(nextPData);
                }

                setPlayer(players.find(player => player.name === props.user.username)!);
                setMessages([...messages!]);
                drawPlayers(players);
            }
        });

        if (socket) return () => socket.disconnect();
    })

    // Game UseEffect
    useEffect(() => {
        drawPlayers(players);

        for (let i = 0; i < cases.length; i++) {
            const caseWidth = cases[i].width;
            const caseHeight = cases[i].height;
            const caseX = cases[i].position.x;
            const caseY = cases[i].position.y;

            const caseAlreadyDrawn = document.getElementById(`case-[${i}]`);

            if (caseAlreadyDrawn) caseAlreadyDrawn.remove();

            const monopolyCase = document.createElement("span", { is: "span" }) as HTMLSpanElement;
            monopolyCase.id = `case-[${i}]`;
            monopolyCase.style.position = "absolute";
            monopolyCase.style.zIndex = "1";
            monopolyCase.style.top = `${caseY}px`;
            monopolyCase.style.left = `${caseX}px`;
            monopolyCase.style.width = `${caseWidth}px`;
            monopolyCase.style.height = `${caseHeight}px`;

            if (cases[i].title.startsWith("Depart")) monopolyCase.className = "depart";
            else if (cases[i].title.startsWith("Caisse")) monopolyCase.className = "caisse";
            else if (cases[i].title.startsWith("Impot")) monopolyCase.className = "impot";
            else if (cases[i].title.startsWith("Gare")) monopolyCase.className = "gare";
            else if (cases[i].title.startsWith("Chance")) monopolyCase.className = "chance";
            else if (cases[i].title.startsWith("Prison")) monopolyCase.className = "prison";
            else if (cases[i].title.startsWith("Compagnie")) monopolyCase.className = "compagnie";
            else if (cases[i].title.startsWith("Parc")) monopolyCase.className = "parc";
            else if (cases[i].title.startsWith("Allez")) monopolyCase.className = "allez";
            else if (cases[i].title.startsWith("Taxe")) monopolyCase.className = "taxe";

            monopolyCase.classList.add("case");

            const board = document.getElementById("board") as HTMLDivElement;
            if (board) board.append(monopolyCase);
        }

        const handleCaseClick = (e: MouseEvent) => {
            const target = e.target as HTMLSpanElement;
            const caseId = target.id;
            const caseIndex = parseInt(caseId.replace("case-[", "").replace("]", ""));
            console.log(cases[caseIndex]);
        }

        const monopolyCases = document.getElementsByClassName("case") as HTMLCollectionOf<HTMLSpanElement>;
        for (let i = 0; i < monopolyCases.length; i++) monopolyCases[i].addEventListener("click", handleCaseClick);
    });

    return (
        <>
            <Head>
                <title>Monopoly</title>
                <meta name="description" content="Monopoly" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="monopoly">
                {!started && (
                    <div className="start">
                        <h2>Monopoly</h2>
                        <p>Rejoins la partie pour commencer</p>
                        <span>{players?.length} / 8</span>
                        <button onClick={startGame} disabled={((players?.length ?? 0) < 2) || (props.game.owner !== props.user.username)}>Commencer la partie</button>
                        <button onClick={shareGame}>Partager la partie</button>
                    </div>
                )}
                <div className="argent">
                    {players.map(player => (
                        <>
                            <h2 key={player.name}><span className="playerCircle" style={{ backgroundColor: playerColor[players.findIndex(p => p.name === player.name)] }}></span>{player.name} :</h2>
                            <p key={player.name + "-money"}>{player.money}€</p>
                        </>
                    ))}
                </div>
                <div className="board" id="board">
                    <Image src={"/monopoly/plateau.jpg"} alt="Monopoly" width={1241} height={1241} />

                    <div className="chanceCard">
                        <div className="inner">
                            <div className="front">
                                <img src={"/monopoly/chance_card_back.png"} alt="Chance" />
                            </div>
                            <div className="back">
                                goodbye
                            </div>
                        </div>
                    </div>

                    <div className="communityChestCard">
                        <div className="inner">
                            <div className="front">
                                <img src={"/monopoly/community_chest_back.png"} alt="Community Chest" />
                            </div>
                            <div className="back">
                                goodbye
                            </div>
                        </div>
                    </div>

                    {(playerTurn.name === props.user.username) && started && (
                        <div className="dice">
                            <button className="roll-btn" id="roll" onClick={diceRoll}>Lancer</button>

                            <div className="dice-container">
                                <div id="dice1">
                                    <div className="dots-group">
                                        <div className="dot top-left"></div>
                                        <div className="dot top"></div>
                                        <div className="dot top-right"></div>
                                        <div className="dot bottom-left"></div>
                                        <div className="dot bottom"></div>
                                        <div className="dot bottom-right"></div>
                                    </div>
                                </div>
                                <div id="dice2">
                                    <div className="dots-group">
                                        <div className="dot top-left"></div>
                                        <div className="dot top"></div>
                                        <div className="dot top-right"></div>
                                        <div className="dot bottom-left"></div>
                                        <div className="dot bottom"></div>
                                        <div className="dot bottom-right"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div id="players">
                        <div className="players-group"></div>
                    </div>
                </div>
                {connected && (
                    <div className="chat">
                        <h2>Chat</h2>
                        <div className="messages">
                            {messages?.map((message: any, index) => (
                                <div key={index} className="message">
                                    <span className="author">{message.username === props.user.username ? "Moi" : message.username}</span>
                                    <span className="content">{message.message}</span>
                                </div>
                            ))}
                        </div>
                        <div className="form">
                            <textarea placeholder="Tapez un message" id="message" ref={messageRef} disabled={!connected} onChange={(e) => setMessage(e.target.value)} value={message} />
                            <button onClick={sendMessage} disabled={!connected}>Envoyer</button>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ game: MonopolyGame, user: { id: string, username: string } }> = async (context) => {
    const { id } = context.params as { id: string }
    const room = await axios.get(`${process.env.APP_URL}/api/games/monopoly/game`, {
        params: {
            gameId: id
        }
    });

    if (room.status !== 200) return {
        redirect: {
            destination: "/games/monopoly",
            permanent: false
        }
    }

    const user = parseUser(context);

    if (!user) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    return {
        props: {
            game: room.data,
            user
        }
    }
}