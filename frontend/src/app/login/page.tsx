"use client";

import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { isGameStaffRole, UserRole } from "@/lib/auth";
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
    role: UserRole;
  };
};

type LoginErrorResponse = {
  detail?: string;
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

      if (isGameStaffRole(response.data.user.role)) {
        router.push("/admin/dashboard");
        return;
      }

      router.push("/player/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setErrorMessage(
            "Não foi possível conectar à API. Verifique a configuração de produção."
          );
          return;
        }

        const data = error.response.data as LoginErrorResponse | undefined;

        if (error.response.status === 401) {
          setErrorMessage(data?.detail || "Usuário ou senha inválidos.");
          return;
        }

        setErrorMessage(
          data?.detail ||
            `Erro ao entrar. A API respondeu com status ${error.response.status}.`
        );
        return;
      }

      setErrorMessage("Não foi possível entrar. Tente novamente.");
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
        </form>
      </section>
    </main>
  );
}
