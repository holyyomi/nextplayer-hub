// 관리자 모드 시뮬레이션 (localStorage)
import { useEffect, useState } from "react";

const KEY = "np-admin-mode";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(KEY) === "1";
  });

  useEffect(() => {
    window.localStorage.setItem(KEY, isAdmin ? "1" : "0");
  }, [isAdmin]);

  return { isAdmin, setIsAdmin, toggle: () => setIsAdmin((v) => !v) };
}
