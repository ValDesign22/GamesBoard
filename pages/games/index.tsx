import Head from "next/head";
import Link from "next/link";

export default function Games() {
    return (
        <>
            <Head>
                <title>Games Board - Jeux de société</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="games">
                <h1 className="title">Jeux de société</h1>
                <p className="description">Liste des jeux de société</p>

                <div className="grid">
                    <Link href="/games/monopoly" className="card">
                        <h3>Monopoly &rarr;</h3>
                        <p>Le jeu de société le plus vendu au monde</p>
                    </Link>
                </div>
            </main>
        </>
    )
}