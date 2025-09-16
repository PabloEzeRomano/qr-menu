"use client";

import { useAuth } from "@/contexts/AuthContextProvider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}
