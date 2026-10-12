"use client";

import { AxiosError } from "axios";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { hasProduct, isGameStaffRole, ProductCode, UserRole } from "@/lib/auth";
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
    products: ProductCode[];
  };
};

export default function LoginPage() {
  const router = useRouter();

  const submitting = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current) return;
    if (!username.trim() || !password) {
      setErrorMessage("Informe seu usuário e sua senha para entrar.");
      return;
    }
    submitting.current = true;
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.post<LoginResponse>("/auth/token/", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (isGameStaffRole(response.data.user.role)) {
        router.push("/admin/dashboard");
        return;
      }

      const hasGame = hasProduct(response.data.user, "GAME");
      const hasMentorship = hasProduct(response.data.user, "MENTORSHIP");
      if (hasGame && hasMentorship) router.push("/dashboard");
      else if (hasMentorship) router.push("/mentorship");
      else router.push("/player/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setErrorMessage(
            "Não foi possível conectar. Confira sua conexão e tente novamente em instantes."
          );
          return;
        }


        if (error.response.status === 401) {
          setErrorMessage("Usuário ou senha incorretos, ou conta desativada. Confira os dados e tente novamente.");
          return;
        }

        if (error.response.status === 429) {
          setErrorMessage("Muitas tentativas de acesso. Aguarde alguns minutos antes de tentar novamente.");
        } else if (error.response.status === 400) {
          setErrorMessage("Confira o usuário e a senha informados e tente novamente.");
        } else if (error.response.status === 403) {
          setErrorMessage("O acesso não foi autorizado. Entre em contato com a responsável pela sua conta.");
        } else {
          setErrorMessage("O serviço de acesso está indisponível no momento. Tente novamente em instantes.");
        }
        return;
      }

      setErrorMessage("Não foi possível entrar. Tente novamente.");
    } finally {
      submitting.current = false;
      setIsLoading(false);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <Image className={styles.logo} src="/cartada-viva-mark.png" alt="" width={58} height={58} priority />
          <div>
            <h1>Cartada Viva</h1>
            <p>Jogo digital de hábitos saudáveis</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
          <div className={styles.field}>
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isLoading}
              aria-describedby={errorMessage ? "login-error" : undefined}
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
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={isLoading}
              aria-describedby={errorMessage ? "login-error" : undefined}
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className={styles.passwordToggle} type="button" aria-pressed={showPassword} disabled={isLoading} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Ocultar senha" : "Mostrar senha"}</button>
          {errorMessage && <p id="login-error" ref={errorRef} role="alert" tabIndex={-1} className={styles.error}>{errorMessage}</p>}

          <button className={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          <Link className={styles.supportLink} href="/player/support">
            Precisa de ajuda? Acesse o suporte
          </Link>
          <div className={styles.legalLinks}><Link href="/terms">Termos de Uso</Link><Link href="/privacy">Privacidade</Link></div>
        </form>
      </section>
    </main>
  );
}
