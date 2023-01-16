import {MonopolyGame, MonopolyPlayer} from "../types";

export const cases = [
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
        height: 160,
        price: 60,
        upgradePrice: 50,
        rent: [2, 10, 30, 90, 160, 250],
        color: "brown",
        hypotheque: 30
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
        height: 160,
        price: 60,
        upgradePrice: 50,
        rent: [4, 20, 60, 180, 320, 450],
        color: "brown",
        hypotheque: 30
    },
    {
        title: "Impots_sur_le_Revenu",
        position: {
            x: 674,
            y: 1080
        },
        width: 100,
        height: 160,
        price: 200
    },
    {
        title: "Gare_Montparnasse",
        position: {
            x: 571,
            y: 1080
        },
        width: 100,
        height: 160,
        price: 200,
        rent: [25, 50, 100, 200],
        hypotheque: 100
    },
    {
        title: "Rue_de_Vaugirard",
        position: {
            x: 469,
            y: 1080
        },
        width: 100,
        height: 160,
        price: 100,
        upgradePrice: 50,
        rent: [6, 30, 90, 270, 400, 550],
        color: "lightBlue",
        hypotheque: 50
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
        height: 160,
        price: 100,
        upgradePrice: 50,
        rent: [6, 30, 90, 270, 400, 550],
        color: "lightBlue",
        hypotheque: 50
    },
    {
        title: "Avenue_de_la_Republique",
        position: {
            x: 162,
            y: 1080
        },
        width: 100,
        height: 160,
        price: 120,
        upgradePrice: 50,
        rent: [8, 40, 100, 300, 450, 600],
        color: "lightBlue",
        hypotheque: 60
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
        height: 100,
        price: 140,
        upgradePrice: 100,
        rent: [10, 50, 150, 450, 625, 750],
        color: "pink",
        hypotheque: 70
    },
    {
        title: "Compagnie_de_la_distribution_d_electricite",
        position: {
            x: 0,
            y: 878
        },
        width: 160,
        height: 100,
        price: 150,
        rent: [40, 100],
        hypotheque: 75
    },
    {
        title: "Avenue_de_Neuilly",
        position: {
            x: 0,
            y: 775
        },
        width: 160,
        height: 100,
        price: 140,
        upgradePrice: 100,
        rent: [10, 50, 150, 450, 625, 750],
        color: "pink",
        hypotheque: 70
    },
    {
        title: "Rue_de_Paradis",
        position: {
            x: 0,
            y: 674
        },
        width: 160,
        height: 100,
        price: 160,
        upgradePrice: 100,
        rent: [12, 60, 180, 500, 700, 900],
        color: "pink",
        hypotheque: 80
    },
    {
        title: "Gare_de_Lyon",
        position: {
            x: 0,
            y: 571
        },
        width: 160,
        height: 100,
        price: 200,
        rent: [25, 50, 100, 200],
        hypotheque: 100
    },
    {
        title: "Avenue_Mozart",
        position: {
            x: 0,
            y: 469
        },
        width: 160,
        height: 100,
        price: 180,
        upgradePrice: 100,
        rent: [14, 70, 200, 550, 750, 950],
        color: "orange",
        hypotheque: 90
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
        height: 100,
        price: 180,
        upgradePrice: 100,
        rent: [14, 70, 200, 550, 750, 950],
        color: "orange",
        hypotheque: 90
    },
    {
        title: "Place_Pigalle",
        position: {
            x: 0,
            y: 162
        },
        width: 160,
        height: 100,
        price: 200,
        upgradePrice: 100,
        rent: [16, 80, 220, 600, 800, 1000],
        color: "orange",
        hypotheque: 100
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
        height: 160,
        price: 220,
        upgradePrice: 150,
        rent: [18, 90, 250, 700, 875, 1050],
        color: "red",
        hypotheque: 110
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
        height: 160,
        price: 220,
        upgradePrice: 150,
        rent: [18, 90, 250, 700, 875, 1050],
        color: "red",
        hypotheque: 110
    },
    {
        title: "Boulevard_Henri_Martin",
        position: {
            x: 469,
            y: 0
        },
        width: 100,
        height: 160,
        price: 240,
        upgradePrice: 150,
        rent: [20, 100, 300, 750, 925, 1100],
        color: "red",
        hypotheque: 120
    },
    {
        title: "Gare_du_Nord",
        position: {
            x: 571,
            y: 0
        },
        width: 100,
        height: 160,
        price: 200,
        rent: [25, 50, 100, 200],
        hypotheque: 100
    },
    {
        title: "Faubourg_Saint_Honore",
        position: {
            x: 674,
            y: 0
        },
        width: 100,
        height: 160,
        price: 260,
        upgradePrice: 150,
        rent: [22, 110, 330, 800, 975, 1150],
        color: "yellow",
        hypotheque: 130
    },
    {
        title: "Place_de_la_Bourse",
        position: {
            x: 775,
            y: 0
        },
        width: 100,
        height: 160,
        price: 260,
        upgradePrice: 150,
        rent: [22, 110, 330, 800, 975, 1150],
        color: "yellow",
        hypotheque: 130
    },
    {
        title: "Compagnie_de_distribution_d_eau",
        position: {
            x: 878,
            y: 0
        },
        width: 100,
        height: 160,
        price: 150,
        rent: [40, 100],
        hypotheque: 75
    },
    {
        title: "Rue_La_Fayette",
        position: {
            x: 980,
            y: 0
        },
        width: 100,
        height: 160,
        price: 280,
        upgradePrice: 150,
        rent: [24, 120, 360, 850, 1025, 1200],
        color: "yellow",
        hypotheque: 140
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
        height: 100,
        price: 300,
        upgradePrice: 200,
        rent: [26, 130, 390, 900, 1100, 1275],
        color: "green",
        hypotheque: 150
    },
    {
        title: "Avenue_Foch",
        position: {
            x: 1080,
            y: 264
        },
        width: 160,
        height: 100,
        price: 300,
        upgradePrice: 200,
        rent: [26, 130, 390, 900, 1100, 1275],
        color: "green",
        hypotheque: 150
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
        height: 100,
        price: 320,
        upgradePrice: 200,
        rent: [28, 150, 450, 1000, 1200, 1400],
        color: "green",
        hypotheque: 160
    },
    {
        title: "Gare_Saint-Lazare",
        position: {
            x: 1080,
            y: 571
        },
        width: 160,
        height: 100,
        price: 200,
        rent: [25, 50, 100, 200],
        hypotheque: 100
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
        height: 100,
        price: 350,
        upgradePrice: 200,
        rent: [35, 175, 500, 1100, 1300, 1500],
        color: "blue",
        hypotheque: 175
    },
    {
        title: "Taxe_de_luxe",
        position: {
            x: 1080,
            y: 878
        },
        width: 160,
        height: 100,
        price: 100
    },
    {
        title: "Rue_de_la_Paix",
        position: {
            x: 1080,
            y: 980
        },
        width: 160,
        height: 100,
        price: 400,
        upgradePrice: 200,
        rent: [50, 200, 600, 1400, 1700, 2000],
        color: "blue",
        hypotheque: 200
    }
];

export const chancesCards: {
    title: string;
    name: string;
    type: "money" | "jail" | "move";
    action: (player: MonopolyPlayer, game: MonopolyGame) => { player: MonopolyPlayer, game: MonopolyGame };
    canBeKept?: boolean;
}[]
    = [
    {
        title: "Rendez-vous à la Rue de la Paix",
        name: "rendez_vous_a_la_rue_de_la_paix",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 39;

            return { player, game };
        }
    },
    {
        title: "Avancer jusqu'à la case départ",
        name: "avancer_jusqu_a_la_case_depart",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 0;
            player.money += 200;

            return { player, game };
        }
    },
    {
        title: "Rendez-vous au Boulevard Henri-Martin. Si vous passez par la case départ, recevez 200€",
        name: "rendez_vous_au_boulevard_henri_martin",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            if (player.position > 24) player.money += 200;

            player.position = 24;

            return { player, game };
        }
    },
    {
        title: "Avancez au Boulevard de la Villette. Si vous passez par la case départ, recevez 200€",
        name: "avancez_au_boulevard_de_la_villette",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            if (player.position > 11) player.money += 200;

            player.position = 11;

            return { player, game };
        }
    },
    {
        title: "Vous êtes imposé pour les réparations de voirie à raison de 40€ par maison et 115€ par hôtel.",
        name: "vous_etes_impose_pour_les_reparations_de_voirie",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            const gameHouses = game.houses.filter(house => house.owner === player.name);

            let playerHouses = 0;
            let playerHotels = 0;

            for (let i = 0; i < gameHouses.length; i++) {
                if (gameHouses[i].houses > 0) playerHouses += gameHouses[i].houses;
                if (gameHouses[i].hotel) playerHotels++;
            }

            player.money -= (playerHouses * 40) + (playerHotels * 115);

            return { player, game };
        }
    },
    {
        title: "Avancez jusqu'à la Gare de Lyon. Si vous passez par la case départ, recevez 200€",
        name: "avancez_jusqu_a_la_gare_de_lyon",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            if (player.position > 15) player.money += 200;

            player.position = 15;

            return { player, game };
        }
    },
    {
        title: "Vous avez gagné le prix de mots croisés. Recevez 100€",
        name: "vous_avez_gagne_le_prix_de_mots_croises",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 100;

            return { player, game };
        }
    },
    {
        title: "La banque vous verse un dividende de 50€",
        name: "la_banque_vous_verser_un_dividende",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 50;

            return { player, game };
        }
    },
    {
        title: "Vous êtes libéré de prison. Cette carte peut être conservée jusq'à ce qu'elle soit utilisée ou vendue.",
        name: "vous_etes_libere_de_prison",
        type: "jail",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.inJail = false;
            player.jailTurns = 0;

            return { player, game };
        },
        canBeKept: true
    },
    {
        title: "Reculez de trois cases",
        name: "reculez_de_trois_cases",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position -= 3;

            return { player, game };
        }
    },
    {
        title: "Aller en prison. Rendez-vous directement en prison. Ne franchissez pas par la case départ, ne touchez pas 200€",
        name: "aller_en_prison",
        type: "jail",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 10;
            player.inJail = true;
            player.jailTurns = 0;

            return { player, game };
        }
    },
    {
        title: "Faites des réparations dans toutes vos maisons. Versez pour chaque maison 25€ et pour chaque hôtel 100€",
        name: "faites_des_reparations_dans_toutes_vos_maisons",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            const gameHouses = game.houses.filter(house => house.owner === player.name);

            let playerHouses = 0;
            let playerHotels = 0;

            for (let i = 0; i < gameHouses.length; i++) {
                if (gameHouses[i].houses > 0) playerHouses += gameHouses[i].houses;
                if (gameHouses[i].hotel) playerHotels++;
            }

            player.money -= (playerHouses * 25) + (playerHotels * 100);

            return { player, game };
        }
    },
    {
        title: "Amende pour excès de vitesse 15€",
        name: "amende_pour_exces_de_vitesse",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 15;

            return { player, game };
        }
    },
    {
        title: "Payer pour frais de scolarité 150€",
        name: "payer_pour_frais_de_scolarite",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 150;

            return { player, game };
        }
    },
    {
        title: "Amende pour ivresse 20€",
        name: "amende_pour_ivresse",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 20;

            return { player, game };
        }
    },
    {
        title: "Votre immeuble et votre prêt rapportent. Vous devez toucher 150€",
        name: "votre_immeuble_et_votre_pret_rapportent",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 150;

            return { player, game };
        }
    }
];

export const communityChestCards: {
    title: string;
    name: string;
    type: "money" | "move" | "jail";
    action: (player: MonopolyPlayer, game: MonopolyGame) => { player: MonopolyPlayer, game: MonopolyGame };
    canBeKept?: boolean;
}[]
    = [
    {
        title: "Placez-vous sur la case départ. (Collectez 200€)",
        name: "placez_vous_sur_la_case_depart",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 0;
            player.money += 200;

            return { player, game };
        }
    },
    {
        title: "Erreur de la banque en votre faveur. Recevez 200€",
        name: "erreur_de_la_banque_en_votre_faveur",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 200;

            return { player, game };
        }
    },
    {
        title: "Payez la note du médecin 50€",
        name: "payez_la_note_du_medecin",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 50;

            return { player, game };
        }
    },
    {
        title: "La vente de votre stock vous rapporte 50€",
        name: "la_vente_de_votre_stock_vous_rapporte",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 50;

            return { player, game };
        }
    },
    {
        title: "Vous êtes libéré de prison. Cette carte peut être conservée jusqu'à ce qu'elle soit utilisée ou vendue.",
        name: "vous_etes_libere_de_prison",
        type: "jail",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 10;
            player.inJail = false;
            player.jailTurns = 0;

            return { player, game };
        },
        canBeKept: true
    },
    {
        title: "Retournez à Belleville",
        name: "retournez_a_belleville",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.position = 1;

            return { player, game };
        }
    },
    {
        title: "Recevez votre revenu annuel 100€",
        name: "recevez_votre_revenu_annuel",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 100;

            return { player, game };
        }
    },
    {
        title: "C'est votre anniversaire. Chaque joueur doit vous donner 10€",
        name: "c_est_votre_anniversaire",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            for (let i = 0; i < game.players.length; i++) {
                if (game.players[i].name !== player.name) {
                    game.players[i].money -= 10;
                    player.money += 10;
                }
            }

            return { player, game };
        }
    },
    {
        title: "Les contributions vous remboursent la somme de 20€",
        name: "les_contributions_vous_remboursent_la_somme_de",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 20;

            return { player, game };
        }
    },
    {
        title: "Recevez votre intérêt sur l'emprunt à 7% 25€",
        name: "recevez_votre_interet_sur_l_emprunt_a_7",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 25;

            return { player, game };
        }
    },
    {
        title: "Payez votre Police d'Assurance 50€",
        name: "payez_votre_police_d_assurance",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 50;

            return { player, game };
        }
    },
    {
        title: "Payez une amende de 10€ ou bien tirez une carte Chance",
        name: "payez_une_amende_de_10_ou_bien_tirez_une_carte_chance",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money -= 10;

            return { player, game };
        }
    },
    {
        title: "Rendez-vous à la gare la plus proche. Si vous passez par la case départ, recevez 200€",
        name: "rendez_vous_a_la_gare_la_plus_proche",
        type: "move",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            const gares = [5, 15, 25, 35];
            const newPoses = [];

            for (let i = 0; i < gares.length; i++) newPoses.push(Math.min(Math.abs(player.position - gares[i]), Math.abs(player.position - (gares[i] + 40))));

            const newPlayerPos = gares[newPoses.indexOf(Math.min(...newPoses))];

            if (newPlayerPos < player.position) player.money += 200;

            player.position = newPlayerPos;

            return { player, game };
        }
    },
    {
        title: "Vous avez gagné le deuxième Prix de Beauté. Recevez 10€",
        name: "vous_avez_gagne_le_deuxieme_prix_de_beaute",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 10;

            return { player, game };
        }
    },
    {
        title: "Vous héritez 100€",
        name: "vous_heritez",
        type: "money",
        action: (player: MonopolyPlayer, game: MonopolyGame) => {
            player.money += 100;

            return { player, game };
        }
    }
];