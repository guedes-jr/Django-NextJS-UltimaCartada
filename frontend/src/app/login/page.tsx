"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import styles from "./LoginPage.module.css";

type LoginResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: "ADMIN" | "PLAYER";
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.post<LoginResponse>("/auth/token/", {
        username,
        password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
        return;
      }

      router.push("/player/home");
    } catch {
      setErrorMessage("Usuário ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>♦</div>
          <div>
            <h1>Cartada Viva</h1>
            <p>Jogo digital de hábitos saudáveis</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <button className={styles.googleButton} type="button" disabled>
            Entrar com Google
          </button>

          <p className={styles.helper}>
            O login com Google será habilitado em uma próxima etapa.
          </p>
        </form>
      </section>
    </main>
  );
}
