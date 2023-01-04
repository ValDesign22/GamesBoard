import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import {FormEvent} from "react";

export default function Login() {
    const router = useRouter();

    const login = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const data = {
            username: form.get("username"),
            password: form.get("password"),
        };
        axios.post("/api/auth/login", data).then(() => {
            router.push("/");
        });
    }
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="login">
                <h1>Connectez-vous</h1>
                <form onSubmit={login}>
                    <label htmlFor="username">
                        <input type="text" id="username" placeholder="Nom d'utilisateur" name="username" required />
                    </label>

                    <label htmlFor="password">
                        <input type="password" id="password" placeholder="Mot de passe" name="password" required />
                    </label>

                    <button type="submit">Se connecter</button>
                </form>
            </main>
        </>
    );
}