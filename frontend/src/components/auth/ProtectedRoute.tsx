"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/accountService";
import { AuthUser, isAuthenticated, UserRole, saveAuthUser } from "@/lib/auth";

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

    async function checkAccess() {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        saveAuthUser(currentUser);

        const isSettingsPage =
          window.location.pathname === "/player/settings" ||
          window.location.pathname === "/admin/settings";

        if (currentUser.must_change_password && !isSettingsPage) {
          const settingsPath =
            currentUser.role === "ADMIN" ? "/admin/settings" : "/player/settings";

          router.replace(settingsPath);
          return;
        }

        if (!allowedRoles.includes(currentUser.role)) {
          const fallbackPath =
            currentUser.role === "ADMIN" ? "/admin/dashboard" : "/player/home";

          router.replace(fallbackPath);
          return;
        }

        setUser(currentUser);
        setIsChecking(false);
      } catch {
        logout();
        router.replace("/login");
      }
    }

    checkAccess();
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
