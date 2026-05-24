"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthUser, getAuthUser, isAuthenticated, UserRole } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const hasChecked = useRef(false);

  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (hasChecked.current) {
      return;
    }

    hasChecked.current = true;

    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const authUser = getAuthUser();

    if (!authUser) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(authUser.role)) {
      const fallbackPath =
        authUser.role === "ADMIN" ? "/admin/dashboard" : "/player/home";

      router.replace(fallbackPath);
      return;
    }

    setUser(authUser);
    setIsChecking(false);
  }, [allowedRoles, router]);

  if (isChecking || !user) {
    return (
      <main style={{ padding: 24 }}>
        <p>Carregando...</p>
      </main>
    );
  }

  return children;
}
