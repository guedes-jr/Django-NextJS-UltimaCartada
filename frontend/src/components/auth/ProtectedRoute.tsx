"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/accountService";
import {
  AuthUser,
  isAdminRole,
  isAuthenticated,
  isGameStaffRole,
  UserRole,
  saveAuthUser,
  logout,
} from "@/lib/auth";

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

    function isAllowedRole(role: UserRole) {
      if (allowedRoles.includes(role)) {
        return true;
      }

      return allowedRoles.includes("ADMIN") && isAdminRole(role);
    }

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
            isGameStaffRole(currentUser.role)
              ? "/admin/settings"
              : "/player/settings";

          router.replace(settingsPath);
          return;
        }

        if (!isAllowedRole(currentUser.role)) {
          router.replace(
            isGameStaffRole(currentUser.role)
              ? "/admin/dashboard"
              : "/player/home"
          );
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
