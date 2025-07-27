"use client";

import { useEffect, useState } from "react";
import httpRequest from "./httpRequest";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export const useInfoUser = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const middleWareLogin = async (callback: () => void) => {
    const isUser = await handleGetUser();
    if (isUser) {
      callback();
    } else {
      router.replace("/login");
    }
  };

  const handleGetUser = async () => {
    const user = localStorage.getItem("user");
    if (user) {
      return true;
    }

    try {
      const res = await httpRequest.get("/auth/info");
      if (typeof window !== "undefined" && res?.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      }
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    handleGetUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { user, isLoggedIn: !!user, middleWareLogin, handleGetUser };
};
