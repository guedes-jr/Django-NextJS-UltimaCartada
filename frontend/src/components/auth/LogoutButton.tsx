"use client";

import { useRouter } from "next/navigation";

import { logout } from "@/lib/auth";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <button className={className} type="button" onClick={handleLogout}>
      Sair
    </button>
  );
}
