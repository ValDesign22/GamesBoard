import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import {FormEvent, useEffect, useRef, useState} from "react";
import {MonopolyGame, MonopolyPlayer} from "../../../../util/types";
import axios from "axios";
import {parseUser} from "../../../../util/authFunctions";
import SocketIOClient from "socket.io-client";

export default function Room(props: {game: MonopolyGame, user: {username: string, id: string}}) {
    const [rolling, setRolling] = useState(false);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [started, setStarted] = useState(props.game.started);
    const [players, setPlayers] = useState<MonopolyPlayer[]>(props.game.players);
    const [player, setPlayer] = useState<MonopolyPlayer | null>(null);

    const messageRef = useRef<HTMLTextAreaElement>(null);

    const cases = [
        {
            title: "Depart",
            position: {
                x: 1080,
                y: 1080
            },
            width: 160,
            height: 160
        },
        {
            title: "Boulevard_de_Belleville",
            position: {
                x: 980,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Caisse_de_Communaute",
            position: {
                x: 878,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Rue_Lecourbe",
            position: {
                x: 775,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Impots_sur_le_Revenu",
            position: {
                x: 674,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Gare_Montparnasse",
            position: {
                x: 571,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Rue_de_Vaugirard",
            position: {
                x: 469,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Chance",
            position: {
                x: 366,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Rue_de_Courcelles",
            position: {
                x: 264,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Avenue_de_la_Republique",
            position: {
                x: 162,
                y: 1080
            },
            width: 100,
            height: 160
        },
        {
            title: "Prison",
            position: {
                x: 0,
                y: 1080
            },
            width: 160,
            height: 160
        },
        {
            title: "Boulevard_de_la_Villette",
            position: {
                x: 0,
                y: 980
            },
            width: 160,
            height: 100
        },
        {
            title: "Compagnie_de_la_distribution_d_electricite",
            position: {
                x: 0,
                y: 878
            },
            width: 160,
            height: 100
        },
        {
            title: "Avenue_de_Neuilly",
            position: {
                x: 0,
                y: 775
            },
            width: 160,
            height: 100
        },
        {
            title: "Rue_de_Paradis",
            position: {
                x: 0,
                y: 674
            },
            width: 160,
            height: 100
        },
        {
            title: "Gare_de_Lyon",
            position: {
                x: 0,
                y: 571
            },
            width: 160,
            height: 100
        },
        {
            title: "Avenue_Mozart",
            position: {
                x: 0,
                y: 469
            },
            width: 160,
            height: 100
        },
        {
            title: "Caisse_de_Communaute",
            position: {
                x: 0,
                y: 366
            },
            width: 160,
            height: 100
        },
        {
            title: "Boulevard_Saint_Michel",
            position: {
                x: 0,
                y: 264
            },
            width: 160,
            height: 100
        },
        {
            title: "Place_Pigalle",
            position: {
                x: 0,
                y: 162
            },
            width: 160,
            height: 100
        },
        {
            title: "Parc_Gratuit",
            position: {
                x: 0,
                y: 0
            },
            width: 160,
            height: 160
        },
        {
            title: "Avenue_Matignon",
            position: {
                x: 162,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Chance",
            position: {
                x: 264,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Boulevard_Malesherbes",
            position: {
                x: 366,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Boulevard_Henri_Martin",
            position: {
                x: 469,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Gare_du_Nord",
            position: {
                x: 571,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Faubourg_Saint_Honore",
            position: {
                x: 674,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Place_de_la_Bourse",
            position: {
                x: 775,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Compagnie_de_distribution_d_eau",
            position: {
                x: 878,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Rue_La_Fayette",
            position: {
                x: 980,
                y: 0
            },
            width: 100,
            height: 160
        },
        {
            title: "Allez_en_Prison",
            position: {
                x: 1080,
                y: 0
            },
            width: 160,
            height: 160
        },
        {
            title: "Avenue_de_Breteuil",
            position: {
                x: 1080,
                y: 162
            },
            width: 160,
            height: 100
        },
        {
            title: "Avenue_Foch",
            position: {
                x: 1080,
                y: 264
            },
            width: 160,
            height: 100
        },
        {
            title: "Caisse_de_Communaute",
            position: {
                x: 1080,
                y: 366
            },
            width: 160,
            height: 100
        },
        {
            title: "Boulevard_des_Capucines",
            position: {
                x: 1080,
                y: 469
            },
            width: 160,
            height: 100
        },
        {
            title: "Gare_Saint-Lazare",
            position: {
                x: 1080,
                y: 571
            },
            width: 160,
            height: 100
        },
        {
            title: "Chance",
            position: {
                x: 1080,
                y: 674
            },
            width: 160,
            height: 100
        },
        {
            title: "Avenue_des_Champs_Elysees",
            position: {
                x: 1080,
                y: 775
            },
            width: 160,
            height: 100
        },
        {
            title: "Taxe_de_luxe",
            position: {
                x: 1080,
                y: 878
            },
            width: 160,
            height: 100
        },
        {
            title: "Rue_de_la_Paix",
            position: {
                x: 1080,
                y: 980
            },
            width: 160,
            height: 100
        }
    ];

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

    const sendMessage = () => {
        const gameId = props.game.id;
        const playerName = props.user?.username || "Anonyme";

        axios.post("/api/games/monopoly/chat", {
            gameId,
            message,
            playerName
        }).then((res) => {
            setMessage("");
            messageRef.current?.focus();
        });
    }

    const startGame = () => {
        if (players.length < 2) return;

        axios.post("/api/games/monopoly/start", {
            gameId: props.game.id
        }).then((res) => {
            setStarted(res.data.started);
        });
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
                num: dice1Num + dice2Num,
                user: {
                    id: props.user?.id,
                    username: props.user?.username
                }
            });
        }, 1000);

        setRolling(false);
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
            }
        });

        socket.on("monopoly-start", (data: { gameId: string }) => {
            if (data.gameId === props.game.id) {
                setStarted(true);
                messages.push({ username: "Monopoly", message: `La partie a commencé` });
                setMessages([...messages]);
            }
        });

        socket.on("monopoly-chat", (data: { gameId: string; message: string; playerName: string }) => {
            if (data.gameId === props.game.id) {
                messages?.push({ username: data.playerName, message: data.message });
                setMessages([...messages!]);
            }
        });

        socket.on("monopoly-roll", (data: { gameId: string; num: number; user: { id: string; username: string } }) => {
            if (data.gameId === props.game.id) {
                messages?.push({ username: data.user.username, message: `a fait un ${data.num}` });
                setMessages([...messages!]);
            }
        });

        if (socket) return () => socket.disconnect();
    })

    // Game UseEffect
    useEffect(() => {
        for (let i = 0; i < cases.length; i++) {
            const caseWidth = cases[i].width;
            const caseHeight = cases[i].height;
            const caseX = cases[i].position.x;
            const caseY = cases[i].position.y;

            const caseAlreadyDrawn = document.getElementById(`case-[${i}]`);

            if (caseAlreadyDrawn) caseAlreadyDrawn.remove();

            const monopolyCase = document.createElement("span", {
                is: "span"
            }) as HTMLSpanElement;
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
                        <p>Le jeu de société le plus connu au monde</p>
                        <span>{players?.length} / 8</span>
                        <button onClick={startGame} disabled={players?.length < 2}>Commencer la partie</button>
                    </div>
                )}
                <div className="argent">
                    <h2>Ton argent</h2>
                    <p>{player?.money}</p>
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
                </div>
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