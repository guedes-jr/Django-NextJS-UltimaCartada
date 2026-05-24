"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthUser, getAuthUser, isAuthenticated, UserRole } from "@/lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
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
      if (authUser.role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      router.replace("/player/home");
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
