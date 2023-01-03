import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import {useEffect, useState} from "react";
import { MonopolyPlayer } from "../../../../util/types";
import axios from "axios";

export default function Room(props: {id: string}) {
    const [rolling, setRolling] = useState(false);

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
        action: (player: MonopolyPlayer) => void;
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
                player.position = 24;
            }
        },
        {
            title: "Avancez au Boulevard de la Villette. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
                player.position = 11;
            }
        },
        {
            title: "Vous êtes imposé pour les réparations de voirie à raison de 40M par maison et 115M par hôtel.",
            action: (player: MonopolyPlayer) => {
                player.money -= 40;
            }
        },
        {
            title: "Avancez jusqu'à la Gare de Lyon. Si vous passez par la case départ, recevez 200M",
            action: (player: MonopolyPlayer) => {
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
                player.money -= 25;
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
        action: (player: MonopolyPlayer) => void;
        canBeKept?: boolean;
    }[]
        = [
        {
            title: "Placez-vous sur la case départ. (Collectez 200M)",
            action: (player: MonopolyPlayer) => {
                player.position = 0;
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
            action: (player: MonopolyPlayer) => {
                player.money += 10;
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
                player.position = 5;
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

            if (cases[i].title.startsWith("Depart")) {
                monopolyCase.className = "depart";
            } else if (cases[i].title.startsWith("Caisse")) {
                monopolyCase.className = "caisse";
            } else if (cases[i].title.startsWith("Impot")) {
                monopolyCase.className = "impot";
            } else if (cases[i].title.startsWith("Gare")) {
                monopolyCase.className = "gare";
            } else if (cases[i].title.startsWith("Chance")) {
                monopolyCase.className = "chance";
            } else if (cases[i].title.startsWith("Prison")) {
                monopolyCase.className = "prison";
            } else if (cases[i].title.startsWith("Compagnie")) {
                monopolyCase.className = "compagnie";
            } else if (cases[i].title.startsWith("Parc")) {
                monopolyCase.className = "parc";
            } else if (cases[i].title.startsWith("Allez")) {
                monopolyCase.className = "allez";
            } else if (cases[i].title.startsWith("Taxe")) {
                monopolyCase.className = "taxe";
            }

            monopolyCase.classList.add("case");

            const board = document.getElementById("board") as HTMLDivElement;
            if (board) board.append(monopolyCase);
        }

        const handleCaseClick = (e: MouseEvent) => {
            const target = e.target as HTMLSpanElement;
            const caseId = target.id;
            const caseIndex = parseInt(caseId.replace("case-[", "").replace("]", ""));
            console.log(caseIndex);
        }

        const monopolyCases = document.getElementsByClassName("case") as HTMLCollectionOf<HTMLSpanElement>;
        for (let i = 0; i < monopolyCases.length; i++) monopolyCases[i].addEventListener("click", handleCaseClick);

        const rollButton = document.getElementById("roll") as HTMLButtonElement;

        const dice1 = document.getElementById("dice1") as HTMLDivElement;
        const dotsGroup1 = dice1.getElementsByClassName("dots-group") as HTMLCollectionOf<HTMLDivElement>;
        const dice2 = document.getElementById("dice2") as HTMLDivElement;
        const dotsGroup2 = dice2.getElementsByClassName("dots-group") as HTMLCollectionOf<HTMLDivElement>;

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
            setRolling(true);

            const dice1Num = Math.floor(Math.random() * 6) + 1;
            const dice2Num = Math.floor(Math.random() * 6) + 1;

            dice1.classList.add("roll");
            dice2.classList.add("roll");

            setTimeout(() => {
                dice1.classList.remove("roll")
                dice2.classList.remove("roll")

                drawDots(dotsGroup1, dice1Num);
                drawDots(dotsGroup2, dice2Num);

                setRolling(false);
            }, 1000);
        }

        rollButton.addEventListener("click", () => {
            if (!rolling) diceRoll();
        });
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
                        <button className="roll-btn" id="roll">Lancer</button>

                        <div className="dice-container">
                            <div id="dice1">
                                <div className="dots-group">
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                </div>
                            </div>
                            <div id="dice2">
                                <div className="dots-group">
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                    <div className="dot center"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
    // verify if the room exists
    const { id } = context.params as { id: string }
    const room = await axios.get(`/api/games/${id}`);

    if (room.status !== 200) return { notFound: true }

    return {
        props: {
            id
        }
    }
}